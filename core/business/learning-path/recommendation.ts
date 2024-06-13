import { ApiError } from "@/core/error/api-error";
import { db } from "@/lib/db";
import { elasticsearchClient } from "@/lib/elasticsearch";
import { openAI } from "@/lib/openai"
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { Course } from "@prisma/client";
import { ChatCompletionCreateParams } from 'openai/resources/index.mjs';

const constructRecommendationPrompt = (userQuery: string): ChatCompletionCreateParams['messages'] => {
  return [
    {
      role: 'user',
      content: userQuery
    },
    {
      role: 'system',
      name: 'general-instruction',
      content: `From user's background and query above, suggest the best learning path. You should provide the list of the steps, each step description allow us to find 1 best course with the relevant content and difficulty level, e.g \"Learn advanced React\". If u think that the message isn't suitable the course recommendation function, just generate a normal response`
    },
    {
      role: 'system',
      name: 'format-json',
      content: `For learning path suggestion response, use the JSON format: {type: 'rec', result: array of step description string, given to find the best courses in the learning path step-by-step}. For normal response, use the JSON format: {type: 'rep', result: normal reply}`
    }
  ]
}

export const recommendLearningPath = async (userQuery: string) => {
  const prompt = constructRecommendationPrompt(userQuery)
  const response = await openAI.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: prompt,
    temperature: 1,
    top_p: 1,
    stream: false,
    max_tokens: 500,
    response_format: { type: 'json_object' },
    presence_penalty: 0,
    frequency_penalty: 0.2
  })

  const replyMsg =  JSON.parse(response.choices[0].message.content || '{}')

  if(replyMsg.type === 'rep') {
    throw new ApiError({
      message: 'Please re-enter the prompt, our AI could not understand your request',
      statusCode: 400
    })
  }

  // Return the search strings to be used for searching the learning paths
  const searchStrings = replyMsg.result as string[]

  // embedding each search string and start searching for course
  const searchResults: SearchResponse<unknown, Record<string, AggregationsAggregate>>[] = []
  for(const input of searchStrings) {
    const embeddedText = await openAI.embeddings.create({
      model: 'text-embedding-3-small',
      input,
    })
    const search = await elasticsearchClient.search({
      index: 'learning-paths',
      knn: [
        {
          field: 'title_vector',
          query_vector: embeddedText.data[0].embedding,
          k: 5,
          num_candidates: 100
        },
        {
          field: 'description_vector',
          query_vector: embeddedText.data[0].embedding,
          k: 5,
          num_candidates: 100
        }
      ]
    })
    searchResults.push(search)
  }

  // transform the search result to the courseIds
  /**
   * Array<{
   *   step: string,
   *   allCourseIds: string[]
   * }>
   */

  const courseIdSet = new Set<string>()

  const recommendedResult = searchResults.map((search, index) => {
    const step = searchStrings[index]
    for(const hit of search.hits.hits) {
      courseIdSet.add(hit._id)
    }
    return {
      step,
      allCourseIds: Array.from(new Set(search.hits.hits.map(hit => hit._id)))
    }
  })

  const courses = await db.course.findMany({
    where: {
      id: {
        in: Array.from(courseIdSet)
      }
    }
  })

  const courseMap = courses.reduce((acc, course) => {
    acc[course.id] = course
    return acc
  }, {} as Record<string, Course>)

  return recommendedResult.map(result => {
    const allAvailCourse = result.allCourseIds.map(courseId => courseMap[courseId]).filter(Boolean)
    return {
      step: result.step,
      recommendedCourse: allAvailCourse[0],
      otherCourses: allAvailCourse.slice(1)
    }
  })
}
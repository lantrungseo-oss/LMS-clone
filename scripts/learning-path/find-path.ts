import dotenv from 'dotenv'
dotenv.config();
import {elasticsearchClient} from '@/lib/elasticsearch'
import { openAI } from '@/lib/openai'
import { ChatCompletionCreateParams } from 'openai/resources/index.mjs';

const text = `I have some background in Marketing. I want to become a tech indie hacker, wanting to create a revolutionary tech product and advertise it over the world. What should be my learning plan?`

const generateSearch = async (userQuery: string) => {
  const messages: ChatCompletionCreateParams['messages'] = [
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

  const response = await openAI.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: messages,
    temperature: 1,
    top_p: 1,
    stream: false,
    max_tokens: 500,
    response_format: { type: 'json_object' },
    presence_penalty: 0,
    frequency_penalty: 0.2
  })

  const replyMsg =  JSON.parse(response.choices[0].message.content || '{}')
  if(replyMsg.type === 'rec') {
    return { searchStrings: replyMsg.result as string[] }
  }

  return { normalReply: replyMsg.result as string, searchStrings: [] as string[] }
}

const main = async () => {
  const result = await generateSearch(text)
  console.log('Original user query', text)
  console.log(result);

  for(const input of result.searchStrings) {
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

    console.log('Search string', input)
    console.log('search result', search.hits.hits)
  }
}

main().then(() => console.log('Done')).catch(err => console.error('Error', err))
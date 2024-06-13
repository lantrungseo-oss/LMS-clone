import dotenv from 'dotenv'
dotenv.config();
import { recursivePaginationCall } from '@/core/libs/paginations'
import { parseArgmumentArgs } from '@/core/libs/parse-argument-args'
import { openAI } from '@/lib/openai'
import { elasticsearchClient } from '@/lib/elasticsearch';
import { promisify } from 'util';
import { db } from '@/lib/db';
import { Course } from '@prisma/client';

const wait = promisify(setTimeout)

const config = {
  indexName: 'learning-paths',
}

const indexCourse = async (course: Course) => {
  const courseTitle = course.title;
  const courseDescription = course.description

  const response = await openAI.embeddings.create({
    model: 'text-embedding-3-small',
    input: [courseTitle, ...(courseDescription ? [courseDescription] : [])]
  })

  const embeddedCourse = {
    title_vector: response.data[0].embedding,
    description_vector: response.data[1].embedding,
    title: course.title,
    description: course.description,
  }

  await elasticsearchClient.index({
    index: config.indexName,
    body: embeddedCourse,
    id: course.id,
  })

  console.log('Finish indexing the course', course.id)

}

const main = async () => {
  console.log('Update the index for each course in Elasticsearch index', config.indexName)
  await elasticsearchClient.ping().then(() => console.log('Elasticsearch client is connected'))
  await recursivePaginationCall(async (pagination) => {
    const unIndexedCourses = await db.course.findMany({
      where: {
        isPublished: true,
        lastIndexedAt: null
      },
      take: pagination.limit,
    });

    if(unIndexedCourses.length === 0) {
      return []
    }

    await Promise.all(unIndexedCourses.map(indexCourse))

    const lastIndexedAt = new Date();
    await db.course.updateMany({
      where: {
        id: {
          in: unIndexedCourses.map(c => c.id)
        }
      },
      data: {
        lastIndexedAt
      }
    })

    console.log('Finish the batch of courses', unIndexedCourses.length)

    await wait(200);

    return unIndexedCourses;
  }, { limit: 200, offset: 0 })
}

main()
  .then(() => { console.log('Done!') })
  .catch((e) => console.error(e))
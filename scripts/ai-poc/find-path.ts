import dotenv from 'dotenv'
dotenv.config();
import {elasticsearchClient} from '@/lib/elasticsearch'
import { openAI } from '@/lib/openai'

const text = 'Java learning'

const main = async () => {
  const embeddedText = await openAI.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  })

  const search = await elasticsearchClient.search({
    index: 'lms-ai-poc',
    knn: [
      {
        field: 'name_vector',
        query_vector: embeddedText.data[0].embedding,
        k: 10,
        num_candidates: 100
      },
      {
        field: 'desc_vector',
        query_vector: embeddedText.data[0].embedding,
        k: 10,
        num_candidates: 100
      }
    ]
  })

  console.log(search.hits.hits)
}

main().then(() => console.log('Done')).catch(err => console.error('Error', err))
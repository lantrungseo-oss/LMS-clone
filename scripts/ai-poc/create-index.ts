import dotenv from 'dotenv'
dotenv.config();
import {elasticsearchClient} from '@/lib/elasticsearch'
import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types'

const indexMapping = {
  "properties": {
    "name_vector": {
        "type": "dense_vector",
        "dims": 1536,
        "index": true,
        "similarity": "cosine"
    },
    "desc_vector": {
        "type": "dense_vector",
        "dims": 1536,
        "index": true,
        "similarity": "cosine"
    },
    "name": {"type": "text"},
    "desc": {"type": "text"},
    "url": { "type": "keyword"},
  }
} as MappingTypeMapping;

elasticsearchClient.indices.create({
  index: 'lms-ai-poc',
  mappings: indexMapping,
})
  .then(res => console.log('Index created', res))
  .catch(err => console.error('Index creation error', err));
import dotenv from 'dotenv'
dotenv.config();
import { openAI } from '@/lib/openai'
import { elasticsearchClient } from '@/lib/elasticsearch';

elasticsearchClient.ping()
  .then(() => console.log('Elasticsearch client is connected'))
  .catch(err => console.error('Elasticsearch client connection error', err))
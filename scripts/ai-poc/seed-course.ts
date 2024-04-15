import dotenv from 'dotenv'
dotenv.config();
import { openAI } from '@/lib/openai'
import { elasticsearchClient } from '@/lib/elasticsearch';
import { parse } from 'csv-parse/sync'
import fs from 'fs'

// elasticsearchClient.ping()
//   .then(() => console.log('Elasticsearch client is connected'))
//   .catch(err => console.error('Elasticsearch client connection error', err))

parse(fs.readFileSync(`__data__/Coursera.csv`), {
  skipEmptyLines: true,
  columns: true,
})

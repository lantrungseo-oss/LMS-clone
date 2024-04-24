import { Client } from '@elastic/elasticsearch'
import fs from 'fs';
import path from 'path'

const elasticsearchCfgDir = path.resolve(process.cwd(), 'elasticsearch')

export const elasticsearchClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD as string,
  },
  tls: {
    ca: fs.readFileSync(path.resolve(elasticsearchCfgDir, 'http_ca.crt')),
    rejectUnauthorized: false
  }
})




import dotenv from 'dotenv'
dotenv.config();
import { openAI } from '@/lib/openai'
import { elasticsearchClient } from '@/lib/elasticsearch';
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { promisify } from 'util';
const wait = promisify(setTimeout)
interface ICourse {
  'Course Name': string;
  University: string;
  'Course Description': string;
  'Skills': string;
  'Course URL': string;
}

// elasticsearchClient.ping()
//   .then(() => console.log('Elasticsearch client is connected'))
//   .catch(err => console.error('Elasticsearch client connection error', err))




const main = async () => {
  const data: ICourse[] = parse(fs.readFileSync(`__data__/Coursera.csv`), {
    skipEmptyLines: true,
    columns: true,
  })
  
    // one course first
  let count = 100;
  for(const targetedCourse of data) {
    count--;
    if(count < 0) break;
    const courseName = targetedCourse['Course Name'];
    const courseDescription = targetedCourse['Course Description'];

    const response = await openAI.embeddings.create({
      model: 'text-embedding-3-small',
      input: [courseName, courseDescription]
    })


    const embeddedCourse = {
      name: targetedCourse['Course Name'],
      desc: targetedCourse['Course Description'],
      url: targetedCourse['Course URL'],
      name_vector: response.data[0].embedding,
      desc_vector: response.data[1].embedding,
    }

    const res = await elasticsearchClient.index({
      index: 'lms-ai-poc',
      body: embeddedCourse,
    })

    console.log('Course indexed', res)
  }
  const targetedCourse = data.find(course => course['Course URL'] === 'https://www.coursera.org/learn/android-programming-2') as ICourse;
  
}

main().then(() => console.log('Done')).catch(err => console.error('Error', err))
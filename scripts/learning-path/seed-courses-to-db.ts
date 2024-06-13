import dotenv from 'dotenv'
dotenv.config();
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { promisify } from 'util';
import { db } from '@/lib/db';


const wait = promisify(setTimeout)
interface ICourse {
  'Course Name': string;
  University: string;
  'Course Description': string;
  'Skills': string;
  'Course URL': string;
  'Difficulty Level': string;
}

const userId = 'user_2dd7z3rvQZC3AmoTllm3bVgiMnZ'

const imageUrls = [
  'https://st.depositphotos.com/2001755/3622/i/450/depositphotos_36220949-stock-photo-beautiful-landscape.jpg',
  'https://i.pinimg.com/564x/e0/b8/5c/e0b85ca7e1132d57523244f699a60dc5.jpg',
  'https://images.unsplash.com/photo-1509043759401-136742328bb3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
  'https://st2.depositphotos.com/2001755/5408/i/950/depositphotos_54081723-stock-photo-beautiful-nature-landscape.jpg'
]

export const fromCsvToDb = async () => {
  const data: ICourse[] = parse(fs.readFileSync(`__data__/Coursera.csv`), {
    skipEmptyLines: true,
    columns: true,
  })

  const categories = await db.category.findMany({})

  const batch = 400;
  let startIndex = 1;
  while(startIndex < data.length) {
    const endIndex = Math.min(startIndex + batch, data.length)
    const chunk = data.slice(startIndex, endIndex)
    const courses = chunk.map((course, index) => ({
      title: course['Course Name'],
      description: `${course['Course Description']}<br/>Skills: ${course['Skills']}<br/>Difficulty Level: ${course['Difficulty Level']}`,
      userId,
      imageUrl: imageUrls[index%imageUrls.length],
      price: Math.round(Math.random() * 100 + 20),
      isPublished: true,
      categoryId: categories[index%categories.length].id
    }))

    await db.course.createMany({
      data: courses
    });

    startIndex = endIndex;
  }
}

const seedChapters = async () => {
  const batch = 200;
  let skip = 0;
  while(true) {
    const courses = await db.course.findMany({
      skip: skip,
      take: batch
    })
    if(courses.length === 0) {
      break;
    }
    await db.chapter.createMany({
      data: courses.filter(c => c.id !== 'f06e54a0-219f-4d54-8a51-b1fe4eed601d').flatMap((c) => {
        const chapters = Array.from({ length: Math.round(Math.random() * 10) + 1 }, (_, i) => ({
          title: `Chapter ${i + 1}: ${c.title}`,
          courseId: c.id,
          description: `Chapter ${i+1} description of course ${c.title} <br /> ${c.description}`,
          position: i+1,
          isFree: i == 0,
          isPublished: true,
        }))
        return chapters
      })
    })
    // move forward
    skip += courses.length;
  }
}

export const main = async () => {
  await fromCsvToDb();
  await seedChapters();
}

main()
.then(() => { console.log('Done!') })
.catch((e) => console.error(e))
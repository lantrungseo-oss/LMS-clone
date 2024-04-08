# Build an LMS Platform: Next.js 13,  React, Stripe, Mux, Prisma, Tailwind, MySQL | Full Course 2023

![Copy of Copy of Copy of Copy of Fullstack Twitter Clone (9)](https://github.com/AntonioErdeljac/next13-lms-platform/assets/23248726/fa077fca-bb74-419a-84de-54ac103bb026)


This is a repository for Build an LMS Platform: Next.js 13,  React, Stripe, Mux, Prisma, Tailwind, MySQL | Full Course 2023

[VIDEO TUTORIAL](https://www.youtube.com/watch?v=Big_aFLmekI)

Key Features:

- Browse & Filter Courses
- Purchase Courses using Stripe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS Video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MySQL database using Planetscale

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/next13-lms-platform.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=mysql://root:example_password@localhost:3306/example_db

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_TEACHER_ID=
OPENAI_API_KEY=
```

### Setup Database and Prisma

### For initial setup

```shell
npx prisma generate
npx prisma db push
```

### For updating schema & custom db migration

```shell
npx prisma migrate dev --create-only
# customize the newly generated migration.sql script

npx prisma migrate deploy

npx prisma generate # run this to regenerate the prisma client
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |

## Open-source everthing

- Tdarr: https://docs.tdarr.io/docs/installation/docker/run-compose (Later try)

- Fluent FFMPEG: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg (Quick one -> Create an adapter for build & deploy)

- Implementation reference for VOD: https://github.com/theserverfault/HLS-transcoding-nodejs/blob/master/create-hls-vod.sh

- VOD on AWS: https://github.com/aws-solutions/video-on-demand-on-aws (Adapter for upload & transcode video)

- Upload: Mount to local file (Adapter)

- Stream CDN: https://github.com/MohamedBakoush/docker-HLS-streaming-server/blob/main/Dockerfile

## Elasticsearch & Kibana

### Local setup


Run these 2 commands

```bash
docker-compose up -d elastic
docker-compose up -d kibana
```

And then follow the instructions here: https://www.elastic.co/guide/en/elasticsearch/reference/current/run-elasticsearch-locally.html to set it up properly.

For maintaing configuration, we can use https://library.tf/providers/elastic/elasticstack/latest/docs/resources/elasticsearch_script


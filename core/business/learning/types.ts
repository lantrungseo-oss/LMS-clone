import type prisma from "@prisma/client";

export type Course = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      videoData: {
        playbackId?: string | null;
       }
    })[]
  })[]
};


export type CourseRepoReadFullCourseResponse = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      muxData: prisma.MuxData[]
    })[]
  })[]
};
export interface CourseRepo {
  readFullCourse(id: string): Promise<CourseRepoReadFullCourseResponse | null>;
}
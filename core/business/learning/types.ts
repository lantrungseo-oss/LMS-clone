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
  read(id: string): Promise<prisma.Course | null>
}

export interface ChapterRepo {
  read(id: string): Promise<prisma.Chapter | null>
}

export type ActivityReadResult = prisma.ChapterActivity & {
  videoData?: {
    playbackId?: string | null;
  }
}
export interface ActivityRepo {
  getActivityWithVideoData(id: string): Promise<ActivityReadResult | null>;
}
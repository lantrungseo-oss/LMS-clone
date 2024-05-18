import type prisma from "@prisma/client";

export type FullCourseData = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      muxData: prisma.MuxData[]
    })[]
  })[]
};

export type ReadFullCourseOptions = {
  userIdToGetProgress?: string;
}
import type prisma from "@prisma/client";

export type ChapterActivity = {
  id: string;
  title: string;
  type: string;
}

export interface IQuestion {
  id: number;
  question: string;
  options: { id: number; text: string; }[];
  correctAnswerIndex: number;
}

export interface IQuizData {
  questions: IQuestion[];
}

export type FullCourseData = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      videoData: {
        playbackId?: string | null;
      }
    })[]
  })[]
}

export type ChapterActivityFullData = FullCourseData["chapters"][number]["activities"][number];
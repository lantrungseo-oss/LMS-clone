import { ChapterActivity } from '@prisma/client'

export interface IChapterActivity extends ChapterActivity {};
export interface ICreateActivityInput {
  chapterId: string;
  name: string;
  type: string;
  position: number;
}
export interface IEditActivityInput {
  name?: string;
  content?: string;
  quizData?: Record<string, any>;
  position?: number;
  videoUrl?: string;
}

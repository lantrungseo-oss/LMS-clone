import * as prismaClient from '@prisma/client'

export interface IChapterActivity extends prismaClient.ChapterActivity {};
export interface ICreateActivityInput {
  chapterId: string;
  name: string;
  type: string;
  position: number;
}
export interface IEditActivityInput {
  name?: string;
  videoUrl?: string;
  content?: string;
  position?: number;
}

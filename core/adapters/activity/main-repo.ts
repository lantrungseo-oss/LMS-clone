import { db as primsaDb } from '@/lib/db'
import * as activityAdapterType from './types';

export class MainAcitivyRepo {
  async getActivityCountFromChapter(chapterId: string): Promise<number> {
    return primsaDb.chapterActivity.count({
      where: {
        chapterId
      }
    })
  }
  async createActivity(input: activityAdapterType.ICreateActivityInput): Promise<activityAdapterType.IChapterActivity> {
    const data =  primsaDb.chapterActivity.create({
      data: {
        chapterId: input.chapterId,
        name: input.name,
        type: input.type,
        position: input.position
      }
    })
    return data;
  }

  async editActivity(id: string, input: activityAdapterType.IEditActivityInput): Promise<activityAdapterType.IChapterActivity> {
    return await primsaDb.chapterActivity.update({
      where: {
        id
      },
      data: input
    })
  }

  async deleteActivity(id: string): Promise<void> {
    await primsaDb.chapterActivity.delete({
      where: {
        id
      }
    })
  }

  async getActivity(id: string): Promise<activityAdapterType.IChapterActivity | null> {
    return await primsaDb.chapterActivity.findUnique({
      where: {
        id
      }
    })
  }

  async getActivitiesFromChapter(chapterId: string): Promise<activityAdapterType.IChapterActivity[]> {
    return await primsaDb.chapterActivity.findMany({
      where: {
        chapterId
      }
    })
  }

  async getActivityNewPositionInChapter(chapterId: string): Promise<number> {
    const count = await primsaDb.chapterActivity.count({
      where: {
        chapterId
      }
    })
    return count + 1;
  }
}

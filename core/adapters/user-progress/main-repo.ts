import { db } from "@/lib/db";

export class MainUserProgressRepo {
  async completeUserProgress(userId: string, activityId: string, completedAt: Date) {
    return db.userProgress.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId
        }
      },
      create: {
        userId,
        activityId,
        completedAt
      },
      update: {
        completedAt
      },
    })
  }

  async uncompleteUserProgress(userId: string, activityId: string) {
    return db.userProgress.update({
      where: {
        userId_activityId: {
          userId,
          activityId
        }
      },
      data: {
        completedAt: null
      }
    })
  }
}
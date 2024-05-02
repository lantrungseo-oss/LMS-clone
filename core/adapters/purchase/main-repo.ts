import { db } from "@/lib/db";

export class CoursePurchaseMainRepo {
  async getPurchase(userId: string, courseId: string) {
    return db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })
  }
}
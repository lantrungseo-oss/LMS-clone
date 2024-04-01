import { db } from "@/lib/db";

export class MainCourseRepo {
  read(id: string) {
    return db.course.findUnique({
      where: { id }
    })
  }
}
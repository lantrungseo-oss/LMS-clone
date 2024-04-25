import { db } from "@/lib/db";
import type * as t from "./types";

export class MainCourseRepo {
  read(id: string) {
    return db.course.findUnique({
      where: { id }
    })
  }

  readFullCourse(id: string) {
    return db.course.findUnique({
      where: { id },
      include: {
        chapters: {
          include: {
            activities: {
              include: {
                muxData: true
              }
            }
          }
        }
      }
    }) as Promise<t.FullCourseData | null>;
  }
}
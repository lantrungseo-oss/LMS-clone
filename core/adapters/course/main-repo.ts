import { db } from "@/lib/db";
import type * as t from "./types";

export class MainCourseRepo {
  read(id: string) {
    return db.course.findUnique({
      where: { id }
    })
  }

  readFullCourse(id: string, options?: t.ReadFullCourseOptions) {
    return db.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: {
            position: 'asc',
          },
          include: {
            activities: {
              orderBy: {
                position: 'asc',
              },
              include: {
                muxData: true,
                ...(options?.userIdToGetProgress ? {
                  userProgress: {
                    where: { userId: options.userIdToGetProgress }
                  }
                }: {})
              }
            }
          }
        }
      }
    }).then(data => data);
  }

  doesCourseBelongToUser(courseId: string, userId: string) {
    return db.course.count({
      where: {
        id: courseId,
        userId
      }
    }).then(count => count > 0);
  }

  getCourseFullDataWithFreeChaptersOnly(courseId: string) {
    return db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: {
            position: 'asc',
          },
          where: { isFree: true },
          include: {
            activities: {
              orderBy: {
                position: 'asc',
              },
              include: {
                muxData: true
              }
            }
          }
        }
      }
    })
  }
}
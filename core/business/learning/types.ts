import type prisma from "@prisma/client";

export type Course = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      videoData: {
        playbackId?: string | null;
       }
    })[]
  })[]
};


export type CourseRepoReadFullCourseResponse = prisma.Course & {
  chapters: (prisma.Chapter & {
    activities: (prisma.ChapterActivity & {
      muxData: prisma.MuxData[]
      userProgress?: prisma.UserProgress[];
    })[]
  })[]
};
export interface CourseRepo {
  readFullCourse(id: string, options?: { userIdToGetProgress?: string }): Promise<CourseRepoReadFullCourseResponse | null>;
  read(id: string): Promise<prisma.Course | null>
  doesCourseBelongToUser(courseId: string, userId: string): Promise<boolean>;
  getCourseFullDataWithFreeChaptersOnly(courseId: string): Promise<CourseRepoReadFullCourseResponse | null>
}

export interface ChapterRepo {
  read(id: string): Promise<prisma.Chapter | null>
}

export type ActivityReadResult = prisma.ChapterActivity & {
  videoData?: {
    playbackId?: string | null;
  }
}
export interface ActivityRepo {
  getActivityWithVideoData(id: string): Promise<ActivityReadResult | null>;
  getActivityWithChapter(id: string): Promise<prisma.ChapterActivity & { chapter: prisma.Chapter } | null>;

}

export interface PurchaseRepo {
  getPurchase(userId: string, courseId: string): Promise<prisma.Purchase | null>
}

export interface IGetAuthContextInput {}
export interface IAuthContext {
  userId?: string | null;
}
export interface AuthService {
  getAuthContext(input: IGetAuthContextInput): Promise<IAuthContext>;
}

export interface ICheckCourseAccessOptions {}

export enum ECourseAccessRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface CheckCourseAccessResult {
  grantedAccessRole?: ECourseAccessRole;
  userId?: string | null;
  isFree?: boolean;
}

export type GetFullCourseDataOptions = {
  freeChapterOnly?: boolean;
  userIdToGetProgress?: string;
}
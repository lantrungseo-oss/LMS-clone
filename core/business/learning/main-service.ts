import type * as learningType from './types';
import { ECourseAccessRole } from './types';

export class LearningMainService {
  constructor(
    private readonly couresRepo: learningType.CourseRepo,
    private readonly chapterRepo: learningType.ChapterRepo,
    private readonly activityRepo: learningType.ActivityRepo,
    private readonly purchaseRepo: learningType.PurchaseRepo,
    private readonly authService: learningType.AuthService
  ) {}

  async getActivity(activityId: string) {
    return this.activityRepo.getActivityWithVideoData(activityId);
  }

  async getChapter(chapterId: string) {
    return this.chapterRepo.read(chapterId);
  }

  getCourse(courseId: string) {
    return this.couresRepo.read(courseId);
  }

  async getFullCourseData(courseId: string, options: learningType.GetFullCourseDataOptions) {
    const course = !options.freeChapterOnly ? await this.couresRepo.readFullCourse(courseId, options) : await this.couresRepo.getCourseFullDataWithFreeChaptersOnly(courseId);
    if(!course) {
      return null;
    }
    return {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        activities: chapter.activities.map((activity) => ({
          ...activity,
          muxData: [],
          userProgress: [],
          videoData: {
            playbackId: activity.muxData?.[0]?.playbackId
          },
          completed: !!activity.userProgress?.[0]?.completedAt
        }))
      }))
    }
  }

  async checkCourseAccess(courseId: string, options: learningType.ICheckCourseAccessOptions): Promise<learningType.CheckCourseAccessResult> {
    const { userId } = await this.authService.getAuthContext({});
    if(!userId) {
      return {};
    }
    const doesCourseBelongToUser = await this.couresRepo.doesCourseBelongToUser(courseId, userId);
    if(!doesCourseBelongToUser) {
      const purchase = await this.purchaseRepo.getPurchase(userId, courseId);
      if(purchase) {
        return { userId, grantedAccessRole: ECourseAccessRole.STUDENT };
      }
      return { userId, }
    }

    
    return {
      userId,
      grantedAccessRole: ECourseAccessRole.TEACHER // owner of the course
    }
  }

  async checkCourseAccessForChapter(chapterId: string, options: learningType.ICheckCourseAccessOptions): Promise<learningType.CheckCourseAccessResult> {
    const chapter = await this.chapterRepo.read(chapterId);
    if(!chapter) {
      return {};
    }
    const result = await this.checkCourseAccess(chapter.courseId, options);
    return {
      ...result,
      isFree: chapter.isFree
    }
  }

  async checkCourseAccessForActivity(activityId: string, options: learningType.ICheckCourseAccessOptions): Promise<learningType.CheckCourseAccessResult> {
    const activity = await this.activityRepo.getActivityWithChapter(activityId);
    if(!activity) {
      return {};
    }
    const result = await this.checkCourseAccess(activity.chapter.courseId, options)
    return {
      ...result,
      grantedAccessRole: result.grantedAccessRole,
      isFree: activity.chapter.isFree
    }
  }
}
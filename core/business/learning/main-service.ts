import type * as learningType from './types';

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

  async getFullCourseData(courseId: string) {
    const course =  await this.couresRepo.readFullCourse(courseId);
    if(!course) {
      return null;
    }
    return {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        activities: chapter.activities.map((activity) => ({
          ...activity,
          videoData: {
            playbackId: activity.muxData?.[0]?.playbackId
          }
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
      if(!purchase) {
        return { userId, course: null };
      }
    }
    if(options.readFullCourse) {
      return {
        course: await this.getFullCourseData(courseId),
        userId
      } 
    }
   
    const course = await this.getCourse(courseId);
    
    return {
      course: course && { ...course, chapters: [] },
      userId
    }
  }
}
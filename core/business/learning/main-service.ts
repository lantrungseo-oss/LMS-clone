import { ApiError } from '@/core/error/api-error';
import type * as learningType from './types';
import { ECourseAccessRole } from './types';
import _ from 'lodash';

export class LearningMainService {
  constructor(
    private readonly couresRepo: learningType.CourseRepo,
    private readonly chapterRepo: learningType.ChapterRepo,
    private readonly activityRepo: learningType.ActivityRepo,
    private readonly courseAccessGuard: learningType.ICourseAccessGuard,
    private readonly userProgressRepo: learningType.IUserProgressRepo,
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
    return this.courseAccessGuard.checkCourseAccess(courseId, options);
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

  async updateLearningProgress(activityId: string, userId: string, isCompleted?: boolean) {
    const { grantedAccessRole } = await this.checkCourseAccessForActivity(activityId, {});
    if(!grantedAccessRole) {
      throw new ApiError({
        message: 'Unauthorized access to this course. Please purchase the course to access this content',
        statusCode: 401
      })
    }

    if(_.isNil(isCompleted)) {
      throw new ApiError({
        message: 'isCompleted is required',
        statusCode: 400
      })
    }

    if(isCompleted) {
      return this.userProgressRepo.completeUserProgress(userId, activityId, new Date());
    }

    return this.userProgressRepo.uncompleteUserProgress(userId, activityId);
  }
}
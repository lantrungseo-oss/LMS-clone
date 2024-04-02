import { ApiError } from '@/core/error/api-error';
import * as activityBusinessType from './types'

export class ActivityActionValidator implements activityBusinessType.IActivityActionValidator {
  constructor(
    private readonly chapterRepo: activityBusinessType.IChapterRepo,
    private readonly courseRepo: activityBusinessType.ICourseRepo,
    private readonly activityRepo: Pick<activityBusinessType.IActivityRepo, 'getActivity'>,
  ) {}
  async validate(input: activityBusinessType.IActivityValidationInput, options?: activityBusinessType.IActivityValidationOptions | undefined): Promise<activityBusinessType.IActivityValidationResponse> {
    const chapter = await this.chapterRepo.read(input.chapterId);
    const course = await this.courseRepo.read(input.courseId);
    if (!chapter || !course) {
      throw new ApiError({
        message: 'Chapter or course not found',
        statusCode: 404
      })
    }

    if(chapter.courseId !== input.courseId) {
      throw new ApiError({
        message: 'Chapter is not in the course',
        statusCode: 400
      })
    }

    if(course.userId !== input.userId) {
      throw new ApiError({
        message: 'User is not the owner of this course',
        statusCode: 401
      })
    }

    if(options?.validateActivity) {
      if(!input.activityId) {
        throw new ApiError({
          message: 'Activity id is required',
          statusCode: 400
        })
      }
      const activity = await this.activityRepo.getActivity(input.activityId);
      if(!activity) {
        throw new ApiError({
          message: 'Activity not found',
          statusCode: 404
        })
      }
      if(activity.chapterId !== input.chapterId) {
        throw new ApiError({
          message: 'Activity is not in the chapter',
          statusCode: 400
        })
      }

      return {
        activity
      }
    }
    return {}
  }
}
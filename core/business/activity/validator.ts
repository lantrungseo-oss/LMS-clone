import { ApiError } from '@/core/error/api-error';
import * as activityBusinessType from './types'

export class ActivityActionValidator implements activityBusinessType.IActivityActionValidator {
  constructor(
    private readonly chapterRepo: activityBusinessType.IChapterRepo,
    private readonly courseRepo: activityBusinessType.ICourseRepo,
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

    if(course.userId !== input.userId) {
      throw new ApiError({
        message: 'User is not the owner of this course',
        statusCode: 401
      })
    }
    return {}
  }
}
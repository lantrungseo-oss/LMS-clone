import type * as learningType from './types';

export class LearningMainService {
  constructor(
    private readonly couresRepo: learningType.CourseRepo,
  ) {
    
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
}
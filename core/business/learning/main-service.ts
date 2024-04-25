import type * as learningType from './types';

export class LearningMainService {
  constructor(
    private readonly couresRepo: learningType.CourseRepo,
    private readonly chapterRepo: learningType.ChapterRepo,
    private readonly activityRepo: learningType.ActivityRepo
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
}
import { ApiError } from '@/core/error/api-error';
import * as activityBusinessType from './types'


export class MainActivityService {
  constructor(
    private readonly activityRepo: activityBusinessType.IActivityRepo, 
    private readonly validator: activityBusinessType.IActivityActionValidator
  ) {}

  async createActivity(input: activityBusinessType.ICreateActivityInput): Promise<activityBusinessType.IChapterActivity> {
    await this.validator.validate(input);
    const positionForNewActivity = await this.activityRepo.getActivityNewPositionInChapter(input.chapterId);
    return this.activityRepo.createActivity({
      ...input,
      position: positionForNewActivity
    });
  }

  async editActivity(id: string, input: activityBusinessType.IEditActivityInput): Promise<activityBusinessType.IChapterActivity> {
    await this.validator.validate(input);
    return this.activityRepo.editActivity(id, input.data);
  }

  async deleteActivity(input: activityBusinessType.IDeleteActivityInput): Promise<void> {
    await this.validator.validate(input);
    return this.activityRepo.deleteActivity(input.activityId);
  }

  async getChapterActivities(chapterId: string) {
    return this.activityRepo.getActivitiesFromChapter(chapterId);
  }

  async reOrderActivities(input: activityBusinessType.IActivityReorderInput) {
    await this.validator.validate(input);
    if(input.updatedActivities.length === 0) {
      // nothing to do
      return {
        done: true,
        effect: 'nothing'
      };
    }
    const allActivities = await this.activityRepo.getActivitiesFromChapter(input.chapterId);
    const activitiesAfterUpdate = allActivities.map((activity) => {
      return input.updatedActivities.find((updatedActivity) => updatedActivity.id === activity.id) ?? activity;
    })
    
    const isValidPosition = activitiesAfterUpdate
      .sort((a, b) => a.position - b.position)
      .every((activity, index) => activity.position === index + 1);
    if(isValidPosition) {
      await Promise.all(input.updatedActivities.map(async (activity) => {
        await this.activityRepo.editActivity(activity.id, {
          position: activity.position
        });
      }));
    } else {
      throw new ApiError({
        message: 'Invalid position for activities',
        statusCode: 400
      })
    }
    return {
      done: true,
      effect: 'update'
    };
  }
}
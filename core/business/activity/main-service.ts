import { ApiError } from '@/core/error/api-error';
import * as activityBusinessType from './types'
import { myMux } from '@/lib/mux';


export class MainActivityService {
  constructor(
    private readonly activityRepo: activityBusinessType.IActivityRepo, 
    private readonly validator: activityBusinessType.IActivityActionValidator,
    private readonly activityVideoSvc: activityBusinessType.IActivityVideoService
  ) {}

  async createActivity(input: activityBusinessType.ICreateActivityInput): Promise<activityBusinessType.IChapterActivity> {
    await this.validator.validate(input);
    const positionForNewActivity = await this.activityRepo.getActivityNewPositionInChapter(input.chapterId);
    return this.activityRepo.createActivity({
      ...input,
      position: positionForNewActivity
    });
  }

  async editActivity(input: activityBusinessType.IEditActivityInput): Promise<activityBusinessType.IChapterActivity> {
    await this.validator.validate(input, { validateActivity: true });
    return this.activityRepo.editActivity(input.activityId, input.data);
  }

  async deleteActivity(input: activityBusinessType.IDeleteActivityInput) {
    await this.validator.validate(input, { validateActivity: true });
    await this.activityVideoSvc.deleteActivityVideo(input.activityId);
    await this.activityRepo.deleteActivity(input.activityId);
    return {
      done: true
    }
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

  async getActivity(id: string, options?: activityBusinessType.IGetActivityOptions) {
    const activity = await this.activityRepo.getActivity(id);
    if(!activity) {
      return null
    }
    const videoData: activityBusinessType.IActivityVideoResult | null = options?.includeVideoData ? await this.activityVideoSvc.getVideoDataForActivity(activity?.id) : null
    return {
      ...activity,
      videoData
    }
  }

  async updateActivityVideo(input: activityBusinessType.IUpdateActivityVideoInput) {
    await this.validator.validate(input, { validateActivity: true });
    
    await this.activityRepo.editActivity(input.activityId, {
      videoUrl: input.videoUrl
    });
    
    await this.activityVideoSvc.updateActivityVideo(input.activityId, input.videoUrl);
    return {
      done: true,
    }
  }
}
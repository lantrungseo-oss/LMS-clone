import * as activityAdapterType from '@/core/adapters/activity/types';
import { Chapter, Course, MuxData } from '@prisma/client';

export interface IChapterActivity extends activityAdapterType.IChapterActivity {};
export interface ICreateActivityInput extends Exclude<activityAdapterType.ICreateActivityInput, 'position'> {
  userId: string;
  courseId: string;
};

export interface IDeleteActivityInput {
  userId: string;
  courseId: string;
  chapterId: string;
  activityId: string;
}

export interface IEditActivityInput {
  userId: string;
  activityId: string;
  courseId: string;
  chapterId: string;
  data: Omit<activityAdapterType.IEditActivityInput, 'videoUrl'>;
};

export interface IActivityReorderInput {
  userId: string;
  courseId: string;
  chapterId: string;
  updatedActivities: {
    id: string;
    position: number;
  }[]
}

export interface IUpdateActivityVideoInput {
  userId: string;
  courseId: string;
  chapterId: string;
  activityId: string;
  videoUrl: string;
}

export interface IActivityValidationInput {
  userId: string;
  courseId: string;
  chapterId: string;
  activityId?: string;
}

export interface IActivityValidationOptions {
  validateActivity?: boolean;
}

export interface IActivityValidationResponse {
  activity?: IChapterActivity;
}

export interface IGetActivityOptions {
  includeVideoData?: boolean;
}
export interface IActivityRepo {
  getActivityCountFromChapter(chapterId: string): Promise<number>;
  createActivity(input: activityAdapterType.ICreateActivityInput): Promise<IChapterActivity>;
  editActivity(id: string, input: activityAdapterType.IEditActivityInput): Promise<IChapterActivity>;
  deleteActivity(id: string): Promise<void>;
  getActivity(id: string): Promise<IChapterActivity | null>;
  getActivityNewPositionInChapter(chapterId: string): Promise<number>;
  getActivitiesFromChapter(chapterId: string): Promise<IChapterActivity[]>;
}

export interface IChapter extends Chapter {}

export interface IChapterRepo {
  read(chapterId: string): Promise<IChapter | null>;
}

export interface ICourse extends Course {}

export interface ICourseRepo {
  read(courseId: string): Promise<ICourse | null>;
}

export interface IActivityActionValidator {
  validate(input: IActivityValidationInput, options?: IActivityValidationOptions): Promise<IActivityValidationResponse>;
}

export interface IMuxData extends MuxData {}

export interface ICreateMuxData extends Omit<IMuxData, 'id'> {}

export interface IMuxDataRepo {
  getActivityMuxData(activityId: string): Promise<IMuxData | null>;
  deleteActivityMuxData(activityId: string): Promise<void>;
  createMuxData(data: ICreateMuxData): Promise<IMuxData>;
}

export interface IActivityVideoResult {
  playbackId?: string | null;
}

export interface IUpdateActivityVideoResult {
  playbackId?: string;
}

export interface IActivityVideoService {
  getVideoDataForActivity(activityId: string): Promise<IActivityVideoResult | null>;
  updateActivityVideo(activityId: string, videoUrl: string): Promise<IUpdateActivityVideoResult>;
  deleteActivityVideo(activityId: string): Promise<void>;
}
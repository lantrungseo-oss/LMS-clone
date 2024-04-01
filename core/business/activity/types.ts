import * as activityAdapterType from '@/core/adapters/activity/types';
import { Chapter, Course } from '@prisma/client';

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
  courseId: string;
  chapterId: string;
  data: activityAdapterType.IEditActivityInput;
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

export interface IActivityValidationInput {
  userId: string;
  courseId: string;
  chapterId: string;
}


export interface IActivityValidationOptions {
  
}

export interface IActivityValidationResponse {}

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
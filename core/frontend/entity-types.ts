export type ChapterActivity = {
  id: string;
  title: string;
  type: string;
}

export interface IQuestion {
  id: number;
  question: string;
  options: { id: number; text: string; }[];
  correctAnswerIndex: number;
}

export interface IQuizData {
  questions: IQuestion[];
}
import { IQuestion } from "./entity-types"

export const ACTIVITY_TYPES = [
  { label: 'Video', value: 'video' },
  { label: 'Text', value: 'text' },
  { label: 'Quiz', value: 'quiz' },
]

export enum EFileUploadEndpoint {
  courseImage = 'courseImage',
  courseAttachment = 'courseAttachment',
  chapterVideo = 'chapterVideo',
  activityVideo = 'activityVideo',
  activityContentImage = 'activityContentImage',
}

export const MULTI_CHOICE_QUESTION_TEMPLATE: Omit<IQuestion, 'id'> = {
  question: 'What does IP stands for in the network system?',
  options: [
    { text: 'Internet Protocol', id: 0 },
    { text: 'Internet Provider', id: 1},
    { text: 'Internet Port', id: 2},
    { text: 'Internet Process', id: 3},
  ],
  correctAnswerIndex: 0,
}
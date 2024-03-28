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
}
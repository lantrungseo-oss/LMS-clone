"use client";
import { Video, FileQuestion, File } from 'lucide-react'

export type TActivityIconProps = {
  type: string;
  className?: string
}

export const ActivityIcon = ({ type, className }: TActivityIconProps) => {
  const clsNme = className ? className : 'w-4 h-4'
  switch (type) {
    case "video":
      return <Video className={clsNme} />;
    case "quiz":
      return <FileQuestion className={clsNme} />;
    case "text":
      return <File className={clsNme} />;
    default:
      return null;
  }
}
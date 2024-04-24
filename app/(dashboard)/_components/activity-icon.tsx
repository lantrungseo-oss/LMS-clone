"use client";
import { Video, FileQuestion, File, BookOpen, Info } from 'lucide-react'

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
      return <BookOpen className={clsNme} />
    case "info":
      return <Info className={clsNme}/>
    default:
      return null;
  }
}
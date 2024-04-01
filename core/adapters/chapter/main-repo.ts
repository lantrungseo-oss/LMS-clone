import { db } from "@/lib/db";

export class MainChapterRepo {
  read(id: string) {
    return db.chapter.findUnique({
      where: { id }
    }).then(chapter => chapter)
  }
}
/*
  Warnings:

  - You are about to drop the `QuizQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuizQuestion` DROP FOREIGN KEY `QuizQuestion_chapterActivityId_fkey`;

-- AlterTable
ALTER TABLE `ChapterActivity` ADD COLUMN `quizData` JSON NULL;

-- DropTable
DROP TABLE `QuizQuestion`;

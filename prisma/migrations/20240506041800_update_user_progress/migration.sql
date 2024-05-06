/*
  Warnings:

  - You are about to drop the column `chapterId` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `UserProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,activityId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_chapterId_fkey`;

-- DropIndex
DROP INDEX `UserProgress_userId_chapterId_key` ON `UserProgress`;

-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `chapterId`,
    DROP COLUMN `isCompleted`,
    ADD COLUMN `activityId` VARCHAR(191) NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `quizAttemptData` JSON NULL,
    ADD COLUMN `videoLastWatchedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `UserProgress_activityId_idx` ON `UserProgress`(`activityId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserProgress_userId_activityId_key` ON `UserProgress`(`userId`, `activityId`);

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `ChapterActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

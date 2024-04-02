/*
  Warnings:

  - You are about to drop the column `chapterId` on the `MuxData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `MuxData` DROP FOREIGN KEY `MuxData_chapterId_fkey`;

-- AlterTable
ALTER TABLE `MuxData` DROP COLUMN `chapterId`,
    ADD COLUMN `activityId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `MuxData` ADD CONSTRAINT `MuxData_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `ChapterActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

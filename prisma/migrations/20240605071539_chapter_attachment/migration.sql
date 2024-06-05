-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_courseId_fkey`;

-- AlterTable
ALTER TABLE `Attachment` DROP COLUMN `courseId`,
    ADD COLUMN `chapterId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Attachment_chapterId_idx` ON `Attachment`(`chapterId`);

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

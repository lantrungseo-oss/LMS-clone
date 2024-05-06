-- AlterTable
ALTER TABLE `Purchase` ADD COLUMN `amount` DOUBLE NULL;

UPDATE `Purchase` p, `Course` c
SET p.`amount` = c.price
where c.id = p.courseId;
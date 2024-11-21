/*
  Warnings:

  - You are about to drop the column `responsibilities` on the `experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `experience` DROP COLUMN `responsibilities`;

-- CreateTable
CREATE TABLE `Responsibility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `experienceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Responsibility` ADD CONSTRAINT `Responsibility_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

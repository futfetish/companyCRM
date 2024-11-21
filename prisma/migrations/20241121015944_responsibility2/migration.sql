-- DropForeignKey
ALTER TABLE `responsibility` DROP FOREIGN KEY `Responsibility_experienceId_fkey`;

-- AddForeignKey
ALTER TABLE `Responsibility` ADD CONSTRAINT `Responsibility_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

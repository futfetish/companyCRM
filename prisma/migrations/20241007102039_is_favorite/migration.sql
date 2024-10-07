-- AlterTable
ALTER TABLE `company` ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false;

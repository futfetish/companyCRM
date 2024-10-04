-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `education` DROP FOREIGN KEY `Education_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `experience` DROP FOREIGN KEY `Experience_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `experience` DROP FOREIGN KEY `Experience_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `experience` DROP FOREIGN KEY `Experience_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `region` DROP FOREIGN KEY `region_countryId_fkey`;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `region` ADD CONSTRAINT `region_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

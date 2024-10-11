-- AlterTable
ALTER TABLE `employee` MODIFY `status` ENUM('fullDay', 'partTime', 'freelancer', 'intern', 'workingStudent', 'night', 'candidate', 'probation', 'dismissed', 'blacklist', 'reserve') NOT NULL;

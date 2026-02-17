/*
  Warnings:

  - You are about to alter the column `category` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `category` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projects` MODIFY `category` VARCHAR(191) NOT NULL;

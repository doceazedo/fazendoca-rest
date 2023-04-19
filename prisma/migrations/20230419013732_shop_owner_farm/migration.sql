/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Shop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[farmId]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_ownerId_fkey";

-- DropIndex
DROP INDEX "Shop_ownerId_key";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "ownerId",
ADD COLUMN     "farmId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Shop_farmId_key" ON "Shop"("farmId");

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

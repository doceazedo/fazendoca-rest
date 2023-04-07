/*
  Warnings:

  - You are about to drop the column `readyAt` on the `Crop` table. All the data in the column will be lost.
  - Added the required column `nextStageAt` to the `Crop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crop" DROP COLUMN "readyAt",
ADD COLUMN     "nextStageAt" TIMESTAMP(3) NOT NULL;

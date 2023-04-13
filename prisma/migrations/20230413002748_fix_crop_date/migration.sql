/*
  Warnings:

  - You are about to drop the column `nextStageAt` on the `Crop` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Crop` table. All the data in the column will be lost.
  - Added the required column `readyAt` to the `Crop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crop" DROP COLUMN "nextStageAt",
DROP COLUMN "stage",
ADD COLUMN     "readyAt" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[plantId]` on the table `Seed` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lootQuantity` to the `Seed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `Seed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seed" ADD COLUMN     "lootQuantity" INTEGER NOT NULL,
ADD COLUMN     "plantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "sellPrice" INTEGER NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seed_plantId_key" ON "Seed"("plantId");

-- AddForeignKey
ALTER TABLE "Seed" ADD CONSTRAINT "Seed_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

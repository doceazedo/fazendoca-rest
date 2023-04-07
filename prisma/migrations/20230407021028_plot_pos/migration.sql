/*
  Warnings:

  - Added the required column `x` to the `Plot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Plot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plot" ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;

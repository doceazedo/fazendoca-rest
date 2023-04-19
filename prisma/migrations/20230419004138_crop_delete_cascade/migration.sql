-- DropForeignKey
ALTER TABLE "Crop" DROP CONSTRAINT "Crop_plotId_fkey";

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

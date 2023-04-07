-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SEED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "balRegular" INTEGER NOT NULL DEFAULT 0,
    "balPremium" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plot" (
    "id" SERIAL NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "Plot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seed" (
    "id" TEXT NOT NULL,
    "growthTime" INTEGER NOT NULL,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "FarmItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" SERIAL NOT NULL,
    "seedId" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "plantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readyAt" TIMESTAMP(3) NOT NULL,
    "wateredUntil" TIMESTAMP(3) NOT NULL,
    "plotId" INTEGER NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItems" (
    "id" SERIAL NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "priceRegular" INTEGER NOT NULL,
    "pricePremium" INTEGER NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "ShopItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farm_ownerId_key" ON "Farm"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Crop_plotId_key" ON "Crop"("plotId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_ownerId_key" ON "Shop"("ownerId");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmItem" ADD CONSTRAINT "FarmItem_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItems" ADD CONSTRAINT "ShopItems_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

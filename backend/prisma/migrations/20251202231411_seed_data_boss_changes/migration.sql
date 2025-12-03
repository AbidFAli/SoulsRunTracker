/*
  Warnings:

  - You are about to drop the column `fp` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Boss` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `BossInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `GameStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `Stat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameStat" DROP CONSTRAINT "GameStat_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_gameId_fkey";

-- DropIndex
DROP INDEX "BossInstance_bossId_locationId_key";

-- DropIndex
DROP INDEX "Location_gameId_order_idx";

-- AlterTable
ALTER TABLE "BossInstance" ADD COLUMN     "gameId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "fp",
ADD COLUMN     "arcane" INTEGER,
ADD COLUMN     "mp" INTEGER;

-- AlterTable
ALTER TABLE "Cycle" ALTER COLUMN "level" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GameStat" ADD COLUMN     "alternateName" TEXT,
ADD COLUMN     "maximum" INTEGER,
ADD COLUMN     "minimum" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "imageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "gameId",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Run" ALTER COLUMN "descriptionUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Stat" ADD COLUMN     "displayName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GameLocation" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "GameLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameLocation_gameId_order_idx" ON "GameLocation"("gameId", "order" ASC);

-- CreateIndex
CREATE INDEX "GameLocation_locationId_idx" ON "GameLocation"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Boss_name_key" ON "Boss"("name");

-- CreateIndex
CREATE INDEX "Boss_imageId_idx" ON "Boss"("imageId");

-- CreateIndex
CREATE INDEX "BossInstance_gameId_idx" ON "BossInstance"("gameId");

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameLocation" ADD CONSTRAINT "GameLocation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameLocation" ADD CONSTRAINT "GameLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInstance" ADD CONSTRAINT "BossInstance_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

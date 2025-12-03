/*
  Warnings:

  - A unique constraint covering the columns `[gameId,locationId,bossId]` on the table `BossInstance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BossInstance_gameId_locationId_bossId_key" ON "BossInstance"("gameId", "locationId", "bossId");

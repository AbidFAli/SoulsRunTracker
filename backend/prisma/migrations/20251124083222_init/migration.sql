-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptionUrl" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "runId" TEXT NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "vitality" INTEGER,
    "intelligence" INTEGER,
    "endurance" INTEGER,
    "strength" INTEGER,
    "dexterity" INTEGER,
    "magic" INTEGER,
    "faith" INTEGER,
    "luck" INTEGER,
    "attunement" INTEGER,
    "resistance" INTEGER,
    "vigor" INTEGER,
    "adaptability" INTEGER,
    "insight" INTEGER,
    "skill" INTEGER,
    "bloodtinge" INTEGER,
    "mind" INTEGER,
    "hp" INTEGER,
    "fp" INTEGER,
    "stamina" INTEGER,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "runId" TEXT NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStat" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "statId" TEXT NOT NULL,

    CONSTRAINT "GameStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boss" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossCompletion" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "instanceId" TEXT NOT NULL,

    CONSTRAINT "BossCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossInstance" (
    "id" TEXT NOT NULL,
    "bossId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BossInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "storageUrl" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE INDEX "Run_gameId_idx" ON "Run"("gameId");

-- CreateIndex
CREATE INDEX "Run_name_idx" ON "Run"("name");

-- CreateIndex
CREATE INDEX "Run_userId_idx" ON "Run"("userId");

-- CreateIndex
CREATE INDEX "Cycle_runId_level_idx" ON "Cycle"("runId", "level" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Character_runId_key" ON "Character"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_imageId_key" ON "Character"("imageId");

-- CreateIndex
CREATE INDEX "Character_imageId_idx" ON "Character"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_name_key" ON "Stat"("name");

-- CreateIndex
CREATE INDEX "GameStat_imageId_idx" ON "GameStat"("imageId");

-- CreateIndex
CREATE INDEX "GameStat_statId_idx" ON "GameStat"("statId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStat_gameId_statId_key" ON "GameStat"("gameId", "statId");

-- CreateIndex
CREATE UNIQUE INDEX "Boss_imageId_key" ON "Boss"("imageId");

-- CreateIndex
CREATE INDEX "Boss_name_idx" ON "Boss"("name");

-- CreateIndex
CREATE INDEX "Location_gameId_order_idx" ON "Location"("gameId", "order" ASC);

-- CreateIndex
CREATE INDEX "BossCompletion_cycleId_idx" ON "BossCompletion"("cycleId");

-- CreateIndex
CREATE INDEX "BossCompletion_instanceId_idx" ON "BossCompletion"("instanceId");

-- CreateIndex
CREATE UNIQUE INDEX "BossCompletion_cycleId_instanceId_key" ON "BossCompletion"("cycleId", "instanceId");

-- CreateIndex
CREATE INDEX "BossInstance_bossId_idx" ON "BossInstance"("bossId");

-- CreateIndex
CREATE INDEX "BossInstance_locationId_order_idx" ON "BossInstance"("locationId", "order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "BossInstance_bossId_locationId_key" ON "BossInstance"("bossId", "locationId");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cycle" ADD CONSTRAINT "Cycle_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boss" ADD CONSTRAINT "Boss_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossCompletion" ADD CONSTRAINT "BossCompletion_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossCompletion" ADD CONSTRAINT "BossCompletion_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "BossInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInstance" ADD CONSTRAINT "BossInstance_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInstance" ADD CONSTRAINT "BossInstance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

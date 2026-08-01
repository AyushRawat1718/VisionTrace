-- CreateEnum
CREATE TYPE "ScreenshotType" AS ENUM ('PERIODIC', 'EVENT_TRIGGERED');

-- CreateEnum
CREATE TYPE "ScreenshotTrigger" AS ENUM ('TIMER', 'COPY', 'PASTE', 'TAB_SWITCH', 'FULLSCREEN_EXIT');

-- AlterTable
ALTER TABLE "Screenshot"
ADD COLUMN "type" "ScreenshotType" NOT NULL DEFAULT 'PERIODIC',
ADD COLUMN "trigger" "ScreenshotTrigger" NOT NULL DEFAULT 'TIMER';
-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'MONITORING_STARTED';
ALTER TYPE "EventType" ADD VALUE 'MONITORING_STOPPED';
ALTER TYPE "EventType" ADD VALUE 'BROWSER_CLOSED';

-- CreateTable
CREATE TABLE "Screenshot" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "confidence" DOUBLE PRECISION,
    "reason" TEXT,
    "rawAnalysis" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Screenshot" ADD CONSTRAINT "Screenshot_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('OPEN', 'RESTRICTED');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "AllowedUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "AllowedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedUser_email_assessmentId_key" ON "AllowedUser"("email", "assessmentId");

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

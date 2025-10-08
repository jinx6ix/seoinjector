/*
  Warnings:

  - Added the required column `issues` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seoScore` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestions` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_userId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "issues" JSONB NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "seoScore" INTEGER NOT NULL,
ADD COLUMN     "suggestions" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Audit_userId_idx" ON "Audit"("userId");

-- CreateIndex
CREATE INDEX "Audit_siteId_idx" ON "Audit"("siteId");

-- CreateIndex
CREATE INDEX "Site_userId_idx" ON "Site"("userId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_siteId_fkey";

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "metrics" JSONB,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "suggestions" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Audit_pageId_idx" ON "Audit"("pageId");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

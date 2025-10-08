-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "pageId" TEXT;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

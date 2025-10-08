-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_siteId_fkey";

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "bestPracticesScore" INTEGER,
ALTER COLUMN "issues" DROP NOT NULL,
ALTER COLUMN "seoScore" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

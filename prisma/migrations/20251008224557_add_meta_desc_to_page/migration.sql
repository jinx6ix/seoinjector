-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "metaDesc" TEXT;

-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "apiKey" DROP NOT NULL;

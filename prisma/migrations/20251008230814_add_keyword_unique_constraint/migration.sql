/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[siteId,keyword]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_siteId_fkey";

-- DropTable
DROP TABLE "Page";

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "h1" TEXT,
    "status" INTEGER,
    "wordCount" INTEGER,
    "metaDesc" TEXT,
    "lastCrawled" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_siteId_url_key" ON "pages"("siteId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_siteId_keyword_key" ON "Keyword"("siteId", "keyword");

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

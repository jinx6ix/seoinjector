/*
  Warnings:

  - A unique constraint covering the columns `[siteId,url]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page_siteId_url_key" ON "Page"("siteId", "url");

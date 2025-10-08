/*
  Warnings:

  - Added the required column `apiKey` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connector` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "connector" TEXT NOT NULL,
ADD COLUMN     "domain" TEXT NOT NULL;

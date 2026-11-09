/*
  Warnings:

  - Added the required column `character` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "character" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "langage" TEXT NOT NULL DEFAULT 'français',
ADD COLUMN     "rules" TEXT NOT NULL;

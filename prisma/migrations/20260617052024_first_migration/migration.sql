-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CHARACTER');

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "physical_description" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "relation_evolution" TEXT[]
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "perceived_mood" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "perceived_traits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "perceived_interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "perceived_notes" TEXT NOT NULL DEFAULT '',
    "relation_with_user" TEXT NOT NULL,
    "actualMood" TEXT NOT NULL,
    "feeling_about_user" TEXT NOT NULL DEFAULT '',
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "characterId" INTEGER
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "conversationId" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_id_key" ON "Character"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_id_key" ON "Conversation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

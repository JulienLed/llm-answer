-- Les messages et conversations existants sont des échanges avec le personnage supprimé
DELETE FROM "Message";
DELETE FROM "Conversation";

-- AlterEnum
ALTER TYPE "Role" RENAME VALUE 'CHARACTER' TO 'ASSISTANT';

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_characterId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "actualMood",
DROP COLUMN "characterId",
DROP COLUMN "feeling_about_user",
DROP COLUMN "perceived_interests",
DROP COLUMN "perceived_mood",
DROP COLUMN "perceived_notes",
DROP COLUMN "perceived_traits",
DROP COLUMN "relation_with_user",
DROP COLUMN "subjects";

-- DropTable
DROP TABLE "Character";

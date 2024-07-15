-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - You are about to drop the column `user_uuid` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_uuid` on the `Chat_Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_uuid` on the `Chat_Message` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `Chat_Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Chat_Message" DROP CONSTRAINT "Chat_Message_receiver_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Chat_Message" DROP CONSTRAINT "Chat_Message_sender_uuid_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "user_uuid";

-- AlterTable
ALTER TABLE "Chat_Message" DROP COLUMN "receiver_uuid",
DROP COLUMN "sender_uuid",
ADD COLUMN     "user_uuid" UUID NOT NULL;

-- CreateTable
CREATE TABLE "_chat" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chat_AB_unique" ON "_chat"("A", "B");

-- CreateIndex
CREATE INDEX "_chat_B_index" ON "_chat"("B");

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chat" ADD CONSTRAINT "_chat_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chat" ADD CONSTRAINT "_chat_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

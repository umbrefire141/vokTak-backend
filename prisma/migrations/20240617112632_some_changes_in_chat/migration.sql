/*
  Warnings:

  - Added the required column `receiver_uuid` to the `Chat_Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_uuid` to the `Chat_Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat_Message" ADD COLUMN     "receiver_uuid" UUID NOT NULL,
ADD COLUMN     "sender_uuid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_receiver_uuid_fkey" FOREIGN KEY ("receiver_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_sender_uuid_fkey" FOREIGN KEY ("sender_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Chat_Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat_Message" DROP CONSTRAINT "Chat_Message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Chat_Message" DROP CONSTRAINT "Chat_Message_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_chat_message_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Sessions" DROP CONSTRAINT "User_Sessions_user_uuid_fkey";

-- DropTable
DROP TABLE "Chat_Message";

-- DropTable
DROP TABLE "User_Sessions";

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sid" TEXT NOT NULL,
    "user_uuid" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sid_key" ON "user_sessions"("sid");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_chat_message_id_fkey" FOREIGN KEY ("chat_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

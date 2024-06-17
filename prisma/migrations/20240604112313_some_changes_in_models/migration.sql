/*
  Warnings:

  - You are about to drop the column `postUuid` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userUuid` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `postUuid` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `postUuid` on the `TagsOnPosts` table. All the data in the column will be lost.
  - Added the required column `post_uuid` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_uuid` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_uuid` to the `TagsOnPosts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postUuid_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userUuid_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postUuid_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_postUuid_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postUuid",
ADD COLUMN     "post_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "userUuid",
ADD COLUMN     "user_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "postUuid",
ADD COLUMN     "post_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TagsOnPosts" DROP COLUMN "postUuid",
ADD COLUMN     "post_uuid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPosts" ADD CONSTRAINT "TagsOnPosts_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "Post"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "Post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "Post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "User_Info" (
    "id" SERIAL NOT NULL,
    "user_uuid" UUID NOT NULL,
    "languages" TEXT[],
    "currentCity" TEXT,
    "hometown" TEXT,
    "description" TEXT,
    "favoriteMovies" TEXT[],
    "favoriteGames" TEXT[],
    "occupation" TEXT,
    "hobbies" TEXT[],

    CONSTRAINT "User_Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Info_user_uuid_key" ON "User_Info"("user_uuid");

-- AddForeignKey
ALTER TABLE "User_Info" ADD CONSTRAINT "User_Info_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

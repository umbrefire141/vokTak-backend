-- CreateTable
CREATE TABLE "User_Online" (
    "id" SERIAL NOT NULL,
    "online" BOOLEAN NOT NULL,
    "lastOnline" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "User_Online_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Online_user_uuid_key" ON "User_Online"("user_uuid");

-- AddForeignKey
ALTER TABLE "User_Online" ADD CONSTRAINT "User_Online_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

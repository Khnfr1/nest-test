/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserListing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userListingId` on the `ListingImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserListing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Dog', 'Cat', 'Bird', 'Fish', 'Reptile');

-- DropForeignKey
ALTER TABLE "ListingImage" DROP CONSTRAINT "ListingImage_userListingId_fkey";

-- DropForeignKey
ALTER TABLE "UserListing" DROP CONSTRAINT "UserListing_userId_fkey";

-- AlterTable
ALTER TABLE "ListingImage" DROP COLUMN "userListingId",
ADD COLUMN     "userListingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserListing" DROP CONSTRAINT "UserListing_pkey",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'Dog',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "UserListing_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "ListingImage_userListingId_idx" ON "ListingImage"("userListingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingImage_userListingId_order_key" ON "ListingImage"("userListingId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "UserListing_userId_id_key" ON "UserListing"("userId", "id");

-- AddForeignKey
ALTER TABLE "UserListing" ADD CONSTRAINT "UserListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_userListingId_fkey" FOREIGN KEY ("userListingId") REFERENCES "UserListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

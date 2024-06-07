/*
  Warnings:

  - You are about to drop the column `age` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `travelBuddies` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `travelBuddies` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "travelBuddies" DROP COLUMN "isBlocked",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true;

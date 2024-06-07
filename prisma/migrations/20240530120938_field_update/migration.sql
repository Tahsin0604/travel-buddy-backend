/*
  Warnings:

  - Added the required column `profilePic` to the `travelBuddies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travelBuddies" ADD COLUMN     "profilePic" TEXT NOT NULL;

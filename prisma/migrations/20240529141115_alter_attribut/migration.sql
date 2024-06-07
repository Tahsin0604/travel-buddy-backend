/*
  Warnings:

  - You are about to drop the column `detailedDescription` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `trips` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `travelBuddies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useEmail` to the `travelBuddies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `travelBuddies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripTitle` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travelBuddies" ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "useEmail" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "detailedDescription",
DROP COLUMN "summary",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tripTitle" TEXT NOT NULL;

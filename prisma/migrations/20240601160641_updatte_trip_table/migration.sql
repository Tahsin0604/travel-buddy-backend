/*
  Warnings:

  - Changed the type of `itinerary` on the `trips` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "itinerary",
ADD COLUMN     "itinerary" JSONB NOT NULL;

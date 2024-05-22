-- CreateEnum
CREATE TYPE "LostItemStatus" AS ENUM ('NOTFOUND', 'FOUND');

-- AlterTable
ALTER TABLE "lostitems" ADD COLUMN     "lostItemStatus" "LostItemStatus" NOT NULL DEFAULT 'NOTFOUND';

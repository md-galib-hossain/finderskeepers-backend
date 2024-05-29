-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_lostItemId_fkey";

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "itemImg" TEXT,
ALTER COLUMN "lostItemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "lostitems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

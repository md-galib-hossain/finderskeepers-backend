/*
  Warnings:

  - You are about to drop the column `foundItemName` on the `founditems` table. All the data in the column will be lost.
  - Added the required column `lostItemId` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `founditems` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "claims_foundItemId_key";

-- DropIndex
DROP INDEX "claims_userId_key";

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "lostItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "founditems" DROP COLUMN "foundItemName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "lostitems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lostitems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lostitems" ADD CONSTRAINT "lostitems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lostitems" ADD CONSTRAINT "lostitems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "founditemcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "lostitems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

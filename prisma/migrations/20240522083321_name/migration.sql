/*
  Warnings:

  - You are about to drop the `founditemcategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "founditems" DROP CONSTRAINT "founditems_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "lostitems" DROP CONSTRAINT "lostitems_categoryId_fkey";

-- DropTable
DROP TABLE "founditemcategories";

-- CreateTable
CREATE TABLE "itemcategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itemcategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itemcategories_name_key" ON "itemcategories"("name");

-- AddForeignKey
ALTER TABLE "founditems" ADD CONSTRAINT "founditems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "itemcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lostitems" ADD CONSTRAINT "lostitems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "itemcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[classId]` on the table `class_purchases` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "class_purchases" ADD COLUMN     "classId" TEXT;

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "purchaseId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "class_purchases_classId_key" ON "class_purchases"("classId");

-- AddForeignKey
ALTER TABLE "class_purchases" ADD CONSTRAINT "class_purchases_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

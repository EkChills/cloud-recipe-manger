/*
  Warnings:

  - You are about to drop the column `order` on the `Step` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "order";

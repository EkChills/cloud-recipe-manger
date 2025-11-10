/*
  Warnings:

  - You are about to drop the column `measureType` on the `MasterIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `measureType` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Step` table. All the data in the column will be lost.
  - Added the required column `defaultUnit` to the `MasterIngredient` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ingredientName` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instruction` to the `Step` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepNumber` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MasterIngredient" DROP COLUMN "measureType",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "defaultUnit" TEXT NOT NULL,
ALTER COLUMN "pricePerUnit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "categoryId",
ADD COLUMN     "cookTime" INTEGER,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "servings" INTEGER,
ADD COLUMN     "totalCost" DOUBLE PRECISION,
ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "measureType",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "ingredientName" TEXT NOT NULL,
ADD COLUMN     "masterIngredientId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "content",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "instruction" TEXT NOT NULL,
ADD COLUMN     "stepNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RecipeTag" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeTag_tag_idx" ON "RecipeTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTag_recipeId_tag_key" ON "RecipeTag"("recipeId", "tag");

-- CreateIndex
CREATE INDEX "MasterIngredient_name_idx" ON "MasterIngredient"("name");

-- CreateIndex
CREATE INDEX "MasterIngredient_category_idx" ON "MasterIngredient"("category");

-- CreateIndex
CREATE INDEX "Recipe_authorId_idx" ON "Recipe"("authorId");

-- CreateIndex
CREATE INDEX "Recipe_category_idx" ON "Recipe"("category");

-- CreateIndex
CREATE INDEX "RecipeIngredient_recipeId_idx" ON "RecipeIngredient"("recipeId");

-- CreateIndex
CREATE INDEX "Step_recipeId_idx" ON "Step"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

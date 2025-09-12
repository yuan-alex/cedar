/*
  Warnings:

  - You are about to drop the column `model` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ChatMessage" ADD COLUMN     "model" TEXT,
ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "public"."Thread" DROP COLUMN "model";

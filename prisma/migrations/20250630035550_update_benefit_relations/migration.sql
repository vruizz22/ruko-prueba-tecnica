/*
  Warnings:

  - You are about to drop the column `client_id` on the `Benefit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_client_id_fkey";

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "client_id";

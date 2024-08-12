/*
  Warnings:

  - You are about to drop the column `id_usuario` on the `funcao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "funcao" DROP CONSTRAINT "funcao_id_usuario_fkey";

-- AlterTable
ALTER TABLE "funcao" DROP COLUMN "id_usuario";

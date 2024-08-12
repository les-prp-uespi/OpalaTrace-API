/*
  Warnings:

  - Added the required column `id_funcao` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "id_funcao" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_funcao_fkey" FOREIGN KEY ("id_funcao") REFERENCES "funcao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

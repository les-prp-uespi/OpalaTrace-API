/*
  Warnings:

  - Added the required column `id_usuario` to the `funcao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funcao" ADD COLUMN     "id_usuario" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "funcao" ADD CONSTRAINT "funcao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

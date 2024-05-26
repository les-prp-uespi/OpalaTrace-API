import { prisma } from "../dataBase/PrismaClient";
import { Request,Response } from "express";
import { hash } from "bcrypt";

interface IcreatUser{
    id: string;
    nome: string;
    email:string;
    senha: string;

}

export class CreatUser{
    async execute({id,nome,email,senha}: IcreatUser){

        const emailExiste = await prisma.usuarios.findFirst({
            where: {
                email: {
                equals: email,
                mode: "insensitive",
              },
            },
          });
          if (emailExiste) {
            return new Error("Usuario já existe");
          }
         
        
          // criptografar a senha
          const hashPassword = await hash(senha, 10);
      
          // salvar o client
        const usuario = prisma.usuarios.create({
          data: { nome: nome, email:email, senha: hashPassword, id: id },
     
          });
          return usuario;
        }
      }
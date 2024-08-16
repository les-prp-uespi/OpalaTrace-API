import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";
import { z } from "zod";

interface IcriarUsuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  id_funcao: string;
  data: string;
}

export class Usuario {
  async execute({ id, nome, email, senha, id_funcao }: IcriarUsuario) {

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

    // salvar o usuario
    const usuario = prisma.usuarios.create({
      data: { nome: nome, email: email, senha: hashPassword, id_funcao: id_funcao },
    });

    return usuario;
  }
}
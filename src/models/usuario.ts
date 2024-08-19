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

    var { spawn } = require('child_process');

    // O comando 'ls' e o argumento '-a' são passados separadamente.
    var command = spawn('ff', ['accounts', 'create', 'dev']);

    command.stdout.on('data', output => {
      console.log("Output: ", output.toString());
    });

    command.stderr.on('data', error => {
      console.error("Error: ", error.toString());
    });

    command.on('close', code => {
      console.log(`Command exited with code: ${code}`);
    });

    return usuario;
  }
}
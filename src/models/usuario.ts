import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";
import { criarContaFF } from "../utils/criar_conta_ff";
import { Identidades } from "./identidades";
import { normalizeString } from "../utils/normalize_string";

interface IcriarUsuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  id_funcao: string;
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

    const novaConta = await criarContaFF();

    var { spawn } = require('child_process');

    // O comando 'ls' e o argumento '-a' são passados separadamente.
    var command = await spawn('ff', ['accounts', 'create', 'dev']);

    command.stdout.on('data', (output: string) => {
      console.log("Output: ", output.toString());
    });

    command.stderr.on('data', (error: string) => {
      console.error("Error: ", error.toString());
    });

    let novoAgente;

    novoAgente = await Identidades.identidade.createIdentity({
      name: normalizeString(nome),
      key: "0xb37b34cc43e51e762c9304b59956af7bfe7d3f2b",
      parent: "8235dc7a-8065-44b8-939e-e19f6db74a92",
      profile: {
        "nome": nome,
        "email": email,
        "senha": senha
      }
    });

    command.on('close', (code: string) => {
      console.log(`Command exited with code: ${code}`);
    });

    return usuario;
  }
}
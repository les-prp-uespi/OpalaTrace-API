import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";
import { criarContaFF } from "../utils/criar_conta_ff";
import { Identidades } from "./identidades";
import { normalizeString } from "../utils/normalize_string";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";

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

    const identidades = await Identidades.identidade.getIdentities();

    let novoAgente;
    let idDaConta = identidades[identidades.length - 1].id;
    let novoNome = normalizeString(nome)

    try {
      // Salvar o usuário na blockchain
      novoAgente = await Identidades.identidade.createIdentity({
        name: novoNome,
        key: novaConta.address,
        parent: idDaConta,
        profile: {
          "nome": nome,
          "email": email,
          "senha": senha,
          "id_do_usuario": id,
          "id_da_funcao": id_funcao
        }
      });

      // salvar o usuario no Banco de Dados
      const usuario = prisma.usuarios.create({
        data: { nome: nome, email: email, senha: hashPassword, id_funcao: id_funcao },
      });

      return usuario;
    } catch (error) {
      console.error('Erro ao cadastrar o usuário: ', error)
    }


    return 'Erro ao cadastrar o usuário.';

  }
}
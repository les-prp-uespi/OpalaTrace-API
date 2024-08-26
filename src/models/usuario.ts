import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";
import { criarContaFF } from "../utils/criar_conta_ff";
import { Identidades } from "./identidades";
import { normalizeString } from "../utils/normalize_string";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";
import FireFly from "@hyperledger/firefly-sdk";

interface IcriarUsuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  id_funcao: string;
}

interface Opala {
  amount: string,
  destino: string,
  pool: string
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

  async cadastrarOpala(req: Request, nome: string, amount: string) {
    await criarPoolDeOpala(nome);
    await criarMintDeOpala(nome, amount);
  }

  async transferirOpala(req: Request, pool: string, amount: string, destino: string) {
    const pessoa1 = new FireFly({ host: 'http://localhost:5000', namespace: 'default' });
    console.log(`Dados: \nPool:${pool}, Destino: ${destino}, \nAmount: ${amount}`)

    // Importante: isto é um teste. Pra fazer a transferência de 'opala_7', é preciso fazer um 'mint token' antes.
    const minte = await criarMintDeOpala(pool, amount)

    if (minte) {
      const transferencia = await pessoa1.transferTokens({
        // from: origem,
        pool: pool,
        amount: amount,
        to: destino,
        tokenIndex: "1"
      })

      return { type: 'token_transfer', id: transferencia.localId }

    }

    else {
      return "Erro ao transferir opala.";
    }

  }
}
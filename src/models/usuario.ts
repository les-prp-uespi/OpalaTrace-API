import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";
import { criarContaFF } from "../utils/criar_conta_ff";
import { Identidades } from "./identidades";
import { normalizeString } from "../utils/normalize_string";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";
import FireFly from "@hyperledger/firefly-sdk";
import { string } from "zod";
const { v4: uuidv4 } = require('uuid');

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
  async execute({ nome, email, senha, id_funcao }: IcriarUsuario) {

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
          "id_da_funcao": id_funcao
        }
      });

      // Criação do ID do usuário
      const id = novoAgente.id;

      // salvar o usuario no Banco de Dados
      const usuario = prisma.usuarios.create({
        data: { id: id, nome: nome, email: email, senha: hashPassword, id_funcao: id_funcao },
      });

      return usuario;
    } catch (error) {
      console.error('Erro ao cadastrar o usuário: ', error)
    }


    return 'Erro ao cadastrar o usuário.';

  }

  async cadastrarOpala(req: Request, nome: string) {
    await criarPoolDeOpala(nome);

  }

  async transferirOpala(req: Request, pool: string, destino: string, indice: string) {
    const pessoa1 = new FireFly({ host: 'http://localhost:5000', namespace: 'default' });
    console.log(`Dados: \nPool:${pool}, Destino: ${destino}, \nAmount: ${"1"}`)

    // Importante: isto é um teste. Pra fazer a transferência de 'opala_7', é preciso fazer um 'mint token' antes.
    const minte = await criarMintDeOpala(pool, "1")
    console.log("\n\nÍndice: ", indice);

    if (minte) {
      const transferencia = await pessoa1.transferTokens({
        // from: origem,
        pool: pool,
        amount: "1",
        to: destino,
        tokenIndex: indice
      })

      return { type: 'token_transfer', id: transferencia.localId }

    }

    else {
      return "Erro ao transferir opala.";
    }

  }

  async atualizarUsuario(req: Request, res: Response) {
    const { idAtual } = req.params;
    const { novoNome, novoEmail, novaFuncao, novaSenha } = req.body;
    const hashPassword = await hash(novaSenha, 10);

    // Buscar o usuário pelo ID
    const usuarioProcurado = await prisma.usuarios.findFirst({
      where: {
        id: {
          equals: idAtual,
          mode: "insensitive",
        },
      },
    });

    // Verifica se o usuário foi encontrado
    if (usuarioProcurado) {
      // Atualiza os dados do usuário no banco de dados
      const usuarioAtualizado = await prisma.usuarios.update({
        where: {
          id: idAtual,
        },
        data: {
          nome: novoNome,
          email: novoEmail,
          senha: hashPassword,
          id_funcao: novaFuncao,
        },
      });

      // Retorna o usuário atualizado
      return res.json(usuarioAtualizado);
    } else {
      // Caso o usuário não seja encontrado
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
  }

}
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
  pool: string;
  name: string;
  tokenIndex: string
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

  async cadastrarOpala(
    req: Request,
    res: Response,
    id_usuario: string,
    destino: string,
    local: string,
    peso: string,
    tipo: string,
    indice: string
  ) {
    try {
      // Verifica se o usuário existe
      const idEncontrado = await prisma.usuarios.findFirst({
        where: {
          id: {
            equals: id_usuario,
            mode: "insensitive",
          },
        },
      });

      // Caso o usuário seja encontrado
      if (idEncontrado) {
        // Verifica se o usuário tem permissão para cadastrar Opalas (id de lapidadores)
        if (
          idEncontrado.id_funcao == "0d1626ef-8dab-4f4c-9128-3dd3a57c515d" ||
          idEncontrado.id_funcao == "820529c9-4510-4b3e-9c3b-736a682fb6eb"
        ) {
          // Chama o método criarPoolDeOpala para criar a opala
          const opalaCriada = await criarMintDeOpala(res, "opala_30", "1", local, peso, tipo);

          // Verifica se a opala foi criada com sucesso
          if (opalaCriada) {
            const usuario = Identidades.identidade;

            // Realiza a transferência da opala criada
            const transfer = await usuario.transferTokens({
              pool: 'opala_30',
              to: destino,
              tokenIndex: indice,
              amount: '1',
              message: {
                header: {
                  tag: "cadastro_de_opala",
                  topics: undefined,
                },
                data: [
                  {
                    datatype: {
                      name: 'opalaData',
                      version: '1.0'
                    },
                    value: {
                      "local": local,
                      "peso": `${peso}g`,
                      "tipo": tipo
                    }
                  }
                ],
              }

            });

            // Retorna sucesso ao cliente
            res.status(200).json({
              mensagem: "Opala criada e transferida com sucesso.",
              opala: transfer,
            });

          } else {
            // Retorna erro se a criação falhou
            res.status(500).json({
              mensagem: "Falha ao criar a Opala."
            });
          }
        } else {
          // Se o usuário não tem permissão, retorna erro
          res.status(403).json({
            mensagem: "Somente lapidadores podem cadastrar Opalas."
          });
          console.error("Usuário sem permissão para cadastrar Opalas.");
        }
      } else {
        // Caso o usuário não seja encontrado
        res.status(404).json({
          mensagem: "Usuário não encontrado."
        });
      }
    } catch (erro) {
      // Tratamento de erros genéricos
      console.error("Erro ao cadastrar Opala: ", erro);
      res.status(500).json({
        mensagem: "Erro interno ao cadastrar Opala."
      });
    }
  }


  async transferirOpala(req: Request, res: Response, pool: string, destino: string, indice: string, origem: string) {
    const pessoa1 = new FireFly({ host: 'http://localhost:5000', namespace: 'default' });

    try {
      const transferencia = await pessoa1.transferTokens({
        // from: origem,
        // Usuário 18
        key: "0x595c1f08e81a78fe9a4c40faf9285ee60642d43a",
        pool: pool,
        amount: "1",
        to: destino,
        tokenIndex: indice
      })

      return { type: 'token_transfer', id: transferencia.localId }
    } catch (error) {
      console.error("Erro ao transferir Opala:", error);
      return res.status(500).json({ error: "Erro ao transferir Opala", details: error });
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
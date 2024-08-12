import { Request, Response } from "express";
import { CreatUser } from "./creat_user"
import { prisma } from "../dataBase/PrismaClient";
import { CreatFunction } from "../models/funcao";

export class CriarFuncaoController {
    async handle(req: Request, res: Response) {
        const { nome,id} = req.body;
        const criarfuncao = new CreatFunction();
        const result = await criarfuncao.execute({
            id,
            nome,
        });
        if (result instanceof Error) {
            return res.status(400).json(result.message);
        }
        else if (result) {

            return res.status(200).json(result);
        }
        return res.json("Erro ao cadastrar");
    }

    async retornarFuncoes(req: Request, res: Response) {
        const funcoes = await prisma.funcao.findMany();
        return res.json(funcoes)
    }
}
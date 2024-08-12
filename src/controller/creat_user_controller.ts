import { Request, Response } from "express";
import { CreatUser } from "./creat_user"
import { prisma } from "../dataBase/PrismaClient";

export class CriarUsuarioController {
    async handle(req: Request, res: Response) {
        const { nome, email, senha, id, id_funcao } = req.body;
        const criarusuario = new CreatUser();
        const result = await criarusuario.execute({
            id,
            nome,
            email,
            senha,
            id_funcao,
        });
        if (result instanceof Error) {
            return res.status(400).json(result.message);
        }
        else if (result) {

            return res.status(200).json(result);
        }
        return res.json("Erro ao cadastrar");
    }

    async index(req: Request, res: Response) {
        const usuarios = await prisma.usuarios.findMany();
        return res.json(usuarios)
    }
}
import { Request, Response } from "express";
import { Usuario } from "../models/usuario"
import { prisma } from "../dataBase/PrismaClient";
import { z } from 'zod'

export class CriarUsuarioController {
    async handle(req: Request, res: Response) {
        const { nome, email, senha, id, id_funcao } = req.body;
        const criarusuario = new Usuario();
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
        return res.json("Erro ao cadastrar o agente.");
    }

    async index(req: Request, res: Response) {
        const usuarios = await prisma.usuarios.findMany();
        return res.json(usuarios)
    }
}
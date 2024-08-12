import { prisma } from "../dataBase/PrismaClient";
import { Request, Response } from "express";
import { hash } from "bcrypt";

interface IcreatFunction {
    id: string;
    nome: string;

}

export class CreatFunction {
    async execute({ id, nome }: IcreatFunction) {


        // salvar o client
        const usuario = prisma.funcao.create({
            data: { nome: nome },

        });
        return usuario;
    }
}
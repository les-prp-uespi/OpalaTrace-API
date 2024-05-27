import { compare } from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../dataBase/PrismaClient";
import { sign } from "jsonwebtoken";

export class LoginController {
    async authenticate(req: Request, res: Response) {
        const { email, senha } = req.body;

        const usuario = await prisma.usuarios.findUnique({ where: { email } })

        if (!usuario) {
            return res.json({ error: "Usuário não encontrado" });
        }

        const eSenhaValida = await compare(senha, usuario.senha)

        if (!eSenhaValida) {
            return res.json({ error: "Senha inválida."})
        }

        const token = sign({id: usuario.id}, "secret", {expiresIn: "1d"});

        return res.json({usuario, token})
    }

   


}

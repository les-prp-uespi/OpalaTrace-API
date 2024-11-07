import { compare } from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../dataBase/PrismaClient";
import { sign } from "jsonwebtoken";
import { Identidades } from "../models/identidades";

export class LoginController {
    async authenticate(req: Request, res: Response) {
        const { email, senha } = req.body;

        const usuario = await prisma.usuarios.findUnique({ where: { email } })

        if (!usuario) {
            return res.json({ error: "Usuário não encontrado" });
        }

        const eSenhaValida = await compare(senha, usuario.senha)

        if (!eSenhaValida) {
            return res.json({ error: "Senha inválida." })
        }

        const token = sign({ id: usuario.id }, "secret", { expiresIn: "1d" });
        const { nome, id, id_funcao } = usuario;
        const agentes = await Identidades.identidade.getVerifiers("default");

        // Filtro para retornar o ID Ethereum do agente logado
        const agenteEspecifico = agentes.filter(item => item.identity === id);
        const idEthereum = agenteEspecifico.at(0)?.value

        return res.json({ usuario: { nome, id, id_funcao, email, idEthereum }, token });
    }
}

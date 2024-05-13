import { Request, Response } from "express";
import { CreatUser } from "./creat_user"

export class CriarUsuarioController {
    async handle(req: Request, res: Response) {
        const { nome, email, senha, id } = req.body;
        const criarusuario = new CreatUser();
        const result = await criarusuario.execute({
            id,
            nome,
            email,
            senha,
        });
        if (result instanceof Error) {
            return res.status(400).json(result.message);
        }
        else if (result) {

            return res.status(200).json(result);
        }
        return res.json("Erro ao cadastrar");
    }
}
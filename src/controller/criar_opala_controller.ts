import { Request, Response } from "express";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";
import { Usuario } from "../models/usuario";

export class criarOpalaController {
    async adicionar(req: Request, res: Response) {
        const {nome, amount} = req.body;

        // TODO: aqui, ele está executando a mesma função da classe usuário.
        // Apagar essas funções, criar um objeto de Usuario e chamar o método que usa as duas funções abaixo.
        const usuario = new Usuario();
        const opala = usuario.cadastrarOpala(req, nome, amount)

        if (opala instanceof Error) {
            return res.status(400).json(opala.message);
        }
        else if (opala) {

            return res.status(200).json(opala);
        }
        return res.json("Erro ao cadastrar o agente.");
    }
}
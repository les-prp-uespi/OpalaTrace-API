import { Request, Response } from "express";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";
import { Usuario } from "../models/usuario";

export class criarOpalaController {
    async adicionar(req: Request, res: Response) {
        const { nome, id_funcao, destino, id_usuario, local, peso, tipo } = req.body;

        const usuario = new Usuario();
        const opala = usuario.cadastrarOpala(req, res, id_usuario, destino, local, peso, tipo);

        if (opala instanceof Error) {
            console.log(opala.message);
        }
        else if (opala) {

            console.log(opala);
        }
        // return res.json("Erro ao cadastrar o agente.");
    }

    async transferir(req: Request, res: Response) {
        const usuario = new Usuario();
        const { pool, destino, indice } = req.body
        const transfere = await usuario.transferirOpala(req, res, pool, destino, indice, "")

        if (transfere instanceof Error) {
            console.log(transfere.message);
        }
        else if (transfere) {

            console.log(transfere);
        }
        console.log("Erro ao cadastrar o agente.");
    }
}
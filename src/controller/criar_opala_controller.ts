import { Request, Response } from "express";
import { criarMintDeOpala, criarPoolDeOpala } from "../utils/adicionar_opala";
import { Usuario } from "../models/usuario";

export class criarOpalaController {
    async adicionar(req: Request, res: Response) {
        const { nome, id_funcao, destino, id_usuario, local, peso, tipo, indice } = req.body;

        const usuario = new Usuario();
        const opala = usuario.cadastrarOpala(req, res, id_usuario, destino, local, peso, tipo, indice);

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
        const { pool, destino, indice, origem } = req.body
        try {
            const transfere = await usuario.transferirOpala(req, res, pool, destino, indice, origem);
            
            return res.status(200).json({
                mensagem: "Opala transferida com sucesso.",
                opala: transfere
            });

        } catch (error) {
            return res.status(500).json({ error: "Erro ao transferir Opala", details: error });
        }
    }
}
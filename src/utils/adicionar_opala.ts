import FireFly from "@hyperledger/firefly-sdk";
import { Request, Response } from "express";
import { Identidades } from "../models/identidades";

interface Opala {
    nome: string
}

export async function criarPoolDeOpala(nome: string) {
    const usuario = Identidades.identidade;

    const pool = await usuario.createTokenPool({ name: nome, type: 'nonfungible' }, { publish: true });

    return pool;
}

async function verificarExistenciaDeOpala(nome: string, amount: string) {
    const usuario = Identidades.identidade;
    const opalaExiste = await usuario.getTokenPools();

    if (amount == "1") {
        var existe = false;

        opalaExiste.forEach(element => {
            if (element.name == nome) {

                console.log('Existe');
                existe = true
            }
        });

        return existe;
    }

    else {
        console.log('Amount:', amount);
        return false;
    }


}

export async function criarMintDeOpala(res: Response, nome: string, amount: string, local: string, peso: string, tipo: string) {
    const resultado = await verificarExistenciaDeOpala(nome, amount);

    if (resultado) {
        try {
            const usuario = Identidades.identidade;
      
            const transfer = await usuario.mintTokens({
              pool: 'opala_30',
              amount: '1',
              message: {
                header: {
                  tag: 'cadastro_de_opala',
                  topics: undefined,
                },
                data: [
                  {
                    datatype: {
                      name: "opalaData",
                      version: "1.0"
                    },
                    value: {
                      "local": local,
                      "peso": `${peso}g`,
                      "tipo": tipo
                    }
                  }
                ],
              }
            });
      
            // Envie a resposta com a ID da transferência
            return res.json({ type: 'token_transfer', id: transfer.localId });
          } catch (error) {
            // Log do erro para depuração
            console.error("Erro ao executar mintTokens:", error);
            return res.status(500).json({ error: "Erro ao executar mintTokens", details: error });
          }
    } else { 
        return false;
    }
}

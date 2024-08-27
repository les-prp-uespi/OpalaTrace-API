import FireFly from "@hyperledger/firefly-sdk";
import { Request, Response } from "express";
import { Identidades } from "../models/identidades";

interface Opala {
    nome: string
}

export async function criarPoolDeOpala(nome: string) {
    const usuario = Identidades.identidade;

    const pool = await usuario.createTokenPool({ name: nome, type: 'nonfungible' }, { publish: true });

    return { type: 'token_pool', id: pool.id }
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

export async function criarMintDeOpala(nome: string, amount: string) {
    const usuario = Identidades.identidade;
    const resultado = await verificarExistenciaDeOpala(nome, amount);

    if (resultado) {
        console.log(`\nA Opala ${resultado ? 'existe no sistema.' : 'não existe no sistema.'}`);
        console.log('\t ', resultado)

    const minte = await usuario.mintTokens({ pool: nome, amount: amount })

    return { type: 'token_transfer', id: minte.localId }
}
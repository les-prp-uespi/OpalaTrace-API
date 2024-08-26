import FireFly from "@hyperledger/firefly-sdk";
import { Request, Response } from "express";
import { Identidades } from "../models/identidades";

interface Opala {
    nome: string
}

export async function criarPoolDeOpala(nome : string) {
    const usuario = Identidades.identidade;

    const pool = await usuario.createTokenPool({ name: nome, type: 'nonfungible' }, { publish: true });

    return { type: 'token_pool', id: pool.id }
}

export async function criarMintDeOpala(nome: string, amount: string) {
    const usuario = Identidades.identidade;

    const minte = await usuario.mintTokens({ pool: nome, amount: amount })

    return { type: 'token_transfer', id: minte.localId }
}
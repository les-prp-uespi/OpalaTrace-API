import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

export function AutenticacaoMiddeware(req: Request, res: Response, next: NextFunction) {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    const [, token] = authorization.split(" ");

    try {
        const decoded = verify(token, "secret");
        const { id } = decoded as TokenPayload;
        req.usuarioId = id;
        next();

    } catch (error) {
        return res.status(401).json({ error: "Token inválido." })
    }

}
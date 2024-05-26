import { Router } from "express";
import { CriarUsuarioController } from "./creat_user_controller";


const router = Router();



const criarUsuarioController = new CriarUsuarioController();


router.post("/post", criarUsuarioController.handle);


export default router;
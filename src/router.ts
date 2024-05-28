import { Router } from "express";
import { CriarUsuarioController } from "./controller/creat_user_controller";
import { LoginController } from "./controller/login_controller";
import { AutenticacaoMiddeware } from "./middleware/auth";


const router = Router();



const criarUsuarioController = new CriarUsuarioController();


router.post("/post", criarUsuarioController.handle);
router.get("/usuarios", criarUsuarioController.index);


export default router;
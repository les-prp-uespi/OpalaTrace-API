import { Router } from "express";
import { CriarUsuarioController } from "./controller/creat_user_controller";
import { LoginController } from "./controller/login_controller";
import { AutenticacaoMiddeware } from "./middleware/auth";


const router = Router();



const criarUsuarioController = new CriarUsuarioController();
const criarLoginController = new LoginController();


router.post("/post", criarUsuarioController.handle);
router.get("/usuarios", AutenticacaoMiddeware, criarUsuarioController.index);
router.post("/auth", criarLoginController.authenticate);


export default router;
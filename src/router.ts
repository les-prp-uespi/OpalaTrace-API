import { Router } from "express";
import { CriarUsuarioController } from "./controller/creat_user_controller";
import { LoginController } from "./controller/login_controller";
import { AutenticacaoMiddeware } from "./middleware/auth";
import { CriarFuncaoController } from "./controller/criar_funcao_controller";
import { criarOpalaController } from "./controller/criar_opala_controller";


const router = Router();



const criarUsuarioController = new CriarUsuarioController();
const criarLoginController = new LoginController();
const criarFuncaoController = new CriarFuncaoController();


router.post("/cadastrar-usuario", criarUsuarioController.handle);
router.get("/usuarios", criarUsuarioController.index);
router.post("/auth", criarLoginController.authenticate);
router.post("/funcoes", criarFuncaoController.handle);
router.get("/listar-funcoes", criarFuncaoController.retornarFuncoes);


export default router;
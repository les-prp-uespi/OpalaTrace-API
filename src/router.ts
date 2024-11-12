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
const criarOpala = new criarOpalaController();

router.post("/cadastrar-usuario", AutenticacaoMiddeware, criarUsuarioController.handle);
router.get("/usuarios", AutenticacaoMiddeware, criarUsuarioController.index);
router.post("/auth", criarLoginController.authenticate);
router.post("/funcoes", criarFuncaoController.handle);
router.get("/listar-funcoes", criarFuncaoController.retornarFuncoes);
router.post("/cadastrar-opala", AutenticacaoMiddeware, criarOpala.adicionar);
router.post("/transferir-opala", AutenticacaoMiddeware, criarOpala.transferir);
router.put("/atualizar-usuario/:idAtual", AutenticacaoMiddeware, criarUsuarioController.editarInfoDoUsuario);
router.get("/retornar-id-ethereum", criarLoginController.retornarIdEthereum);

export default router;
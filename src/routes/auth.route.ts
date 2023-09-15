import { Router } from "express";
import { validateLogin } from "../validators/auth.validators";
import { login } from "../controllers/auth.controller";

const router = Router();

router.post('/login', validateLogin, login);

export default router;
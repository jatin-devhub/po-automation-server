import { Router } from "express";
import { validateGetFile } from "../validators/file.validators";
import { getFile } from "../controllers/file.controller";

const router = Router();

router.get('/:idType/:id', validateGetFile, getFile);

export default router;
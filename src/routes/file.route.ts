import { Router } from "express";
import { validateGetFile, validateUpdateFile } from "../validators/file.validators";
import { getFile, updateFile } from "../controllers/file.controller";

const router = Router();

router.get('/:idType/:id', validateGetFile, getFile);
router.put('/:idType', validateUpdateFile, updateFile)

export default router;
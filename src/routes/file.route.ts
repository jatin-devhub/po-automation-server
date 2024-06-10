import { Router } from "express";
import { validateGetFile, validateNewFile, validateUpdateFile } from "../validators/file.validators";
import { getFile, newFile, updateFile } from "../controllers/file.controller";

const router = Router();

router.get('/:idType/:id', validateGetFile, getFile);
router.put('/:idType', validateUpdateFile, updateFile)
router.post('/:idType', validateNewFile, newFile)

export default router;
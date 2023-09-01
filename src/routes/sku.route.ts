import { Router } from "express";
import { validateNew } from "../validators/sku.validators";
import { skuRegistration } from "../controllers/sku.controller";

const router = Router();

router.post('/new', validateNew, skuRegistration);

export default router;
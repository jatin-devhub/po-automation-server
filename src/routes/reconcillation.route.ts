import { Router } from "express";
import { getApprovedPOs, getPODetailsForReconcillation } from "../controllers/reconcillation.controller";
import { validatePOCode } from "../validators/buying-order.validators";

const router = Router();

router.get('/approved-pos', getApprovedPOs)
router.get('/:poCode', validatePOCode, getPODetailsForReconcillation)

export default router;
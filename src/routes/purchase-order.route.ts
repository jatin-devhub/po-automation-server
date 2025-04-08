import { Router } from "express";
import { validatePOCode, validateNew, validateReview } from "../validators/purchase-order.validators";
import { getUniquePOCodeRoute, applyReview, getPODetails, newPurchaseOrder } from "../controllers/purchase-order.controller";

const router = Router();

router.post('/new', validateNew, newPurchaseOrder);
router.get('/', getUniquePOCodeRoute);
router.post('/review', validateReview, applyReview)
router.get('/:poCode', validatePOCode, getPODetails)

export default router;
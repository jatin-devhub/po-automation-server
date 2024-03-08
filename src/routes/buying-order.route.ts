import { Router } from "express";
import { validatePOCode, validateNew, validateReview } from "../validators/buying-order.validators";
import { newBuyingOrder, getUniquePOCodeRoute, applyReview, getPODetails } from "../controllers/buying-order.controller";

const router = Router();

router.post('/new', validateNew, newBuyingOrder);
router.get('/', getUniquePOCodeRoute);
router.post('/review', validateReview, applyReview)
router.get('/:poCode', validatePOCode, getPODetails)

export default router;
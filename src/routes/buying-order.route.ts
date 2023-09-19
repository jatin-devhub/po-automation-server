import { Router } from "express";
import { validateGetPODetails, validateNew, validateReview } from "../validators/buying-order.validators";
import { newBuyingOrder, getUniquePOCodeRoute, applyReview, getPODetails } from "../controllers/buying-order.controller";

const router = Router();

router.post('/new', validateNew, newBuyingOrder);
router.get('/', getUniquePOCodeRoute);
router.post('/review', validateReview, applyReview)
router.get('/:poCode', validateGetPODetails, getPODetails)

export default router;
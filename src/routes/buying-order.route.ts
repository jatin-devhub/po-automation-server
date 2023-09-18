import { Router } from "express";
import { validateNew, validateReview } from "../validators/buying-order.validators";
import { newBuyingOrder, getUniquePOCodeRoute, applyReview } from "../controllers/buying-order.controller";

const router = Router();

router.post('/new', validateNew, newBuyingOrder);
router.get('/', getUniquePOCodeRoute);
router.post('/review', validateReview, applyReview)

export default router;
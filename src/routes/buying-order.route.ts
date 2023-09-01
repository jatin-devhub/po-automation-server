import { Router } from "express";
import { validateNew } from "../validators/buying-order.validators";
import { newBuyingOrder } from "../controllers/buying-order.controller";

const router = Router();

router.post('/new', validateNew, newBuyingOrder);

export default router;
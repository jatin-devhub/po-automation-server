import { Router } from "express";
import { validateNewInvoice } from "../validators/invoice.validators";
import { newInvoice } from "../controllers/invoice.controller";

const router = Router();

router.post("/new", validateNewInvoice, newInvoice);

export default router;
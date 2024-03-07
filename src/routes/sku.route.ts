import { Router } from "express";
import { validateNew, validateReview, validateVendorCode } from "../validators/sku.validators";
import { applyReview, getUnverifiedSKUs, skuRegistration } from "../controllers/sku.controller";

const router = Router();

router.post('/new/:vendorCode', validateVendorCode, validateNew, skuRegistration);
router.get('/unverified/:vendorCode', validateVendorCode, getUnverifiedSKUs)
router.post('/review', validateReview, applyReview)

export default router;
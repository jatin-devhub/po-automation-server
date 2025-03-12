import { Router } from "express";
import { validateNew, validateReview, validateVendorCode } from "../validators/sku.validators";
import { getUnverifiedSKUs, newSKU } from "../controllers/sku.controller";

const router = Router();

router.post('/new/:vendorCode', validateVendorCode, validateNew, newSKU);
router.get('/unverified/:vendorCode', validateVendorCode, getUnverifiedSKUs)
// router.post('/review', validateReview, applyReview)

export default router;
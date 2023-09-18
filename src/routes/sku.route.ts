import { Router } from "express";
import { validateNew, validateReview, validateSendVerify, validateVendorCode } from "../validators/sku.validators";
import { applyReview, getUnverifiedSKUs, sendVerifyMail, skuRegistration } from "../controllers/sku.controller";

const router = Router();

router.post('/new', validateNew, skuRegistration);
router.post('/send-verify-mail', validateSendVerify, sendVerifyMail)
router.get('/unverified/:vendorCode', validateVendorCode, getUnverifiedSKUs)
router.post('/review', validateReview, applyReview)

export default router;
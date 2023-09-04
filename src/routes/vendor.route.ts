import { Router } from "express";
import { validateNew, validateVendorCode } from "../validators/vendor.validators";
import { getAllVendors, getVendor, vendorRegistration } from "../controllers/vendor.controller";

const router = Router();

router.post('/new', validateNew, vendorRegistration);
router.get('/all', getAllVendors);
router.get('/:vendorCode', validateVendorCode, getVendor)

export default router;
import { Router } from "express";
import { validateNew, validateUpdate, validateValidation, validateVendorCode } from "../validators/vendor.validators";
import { getAllVendors, getVendor, setValidation, updateVendor, vendorRegistration } from "../controllers/vendor.controller";

const router = Router();

router.post('/new', validateNew, vendorRegistration);
router.put('/update/:vendorCode', validateUpdate, updateVendor)
router.post('/validate', validateValidation, setValidation)
router.get('/all', getAllVendors);
router.get('/:vendorCode', validateVendorCode, getVendor)

export default router;
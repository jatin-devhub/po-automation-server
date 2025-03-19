import { Router } from "express";
import { validateNewComplete, validateNewStart, validateUpdate, validateValidation, validateVendorCode } from "../validators/vendor.validators";
import { getAllVendors, getVendor, setValidation, updateVendor, vendorRegistrationComplete, vendorRegistrationStart } from "../controllers/vendor.controller";

const router = Router();

router.post('/new-start', validateNewStart, vendorRegistrationStart)
router.post('/new-complete', validateNewComplete, vendorRegistrationComplete);
router.put('/update/:vendorCode', validateVendorCode, validateUpdate, updateVendor)
router.post('/validate/:vendorCode', validateVendorCode, validateValidation, setValidation);
router.get('/all', getAllVendors);
router.get('/:vendorCode', validateVendorCode, getVendor)

export default router;
import { Router } from "express";
import { validateNew, validateNewStart, validateUpdate, validateUpdatedVendorDetails, validateValidation, validateVendorCode } from "../validators/vendor.validators";
import { getAllVendors, getVendor, setValidation, updateVendor, updateVendorDetails, vendorRegistration, vendorRegistrationStart } from "../controllers/vendor.controller";

const router = Router();

router.post('/new', validateNew, vendorRegistration);
router.post('/new-start', validateNewStart, vendorRegistrationStart)
router.put('/update-details/:vendorCode', validateUpdatedVendorDetails, updateVendorDetails);
router.put('/update/:vendorCode', validateUpdate, updateVendor)
router.post('/validate', validateValidation, setValidation)
router.get('/all', getAllVendors);
router.get('/:vendorCode', validateVendorCode, getVendor)

export default router;
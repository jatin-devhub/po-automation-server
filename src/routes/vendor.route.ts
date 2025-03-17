import { Router } from "express";
import { validateNewComplete, validateNewStart } from "../validators/vendor.validators";
import { getAllVendors, vendorRegistrationComplete, vendorRegistrationStart } from "../controllers/vendor.controller";

const router = Router();

// router.post('/new', validateNew, vendorRegistration);
router.post('/new-start', validateNewStart, vendorRegistrationStart)
router.post('/new-complete', validateNewComplete, vendorRegistrationComplete);
// router.put('/update-details/:vendorCode', validateUpdatedVendorDetails, updateVendorDetails);
// router.put('/update/:vendorCode', validateUpdate, updateVendor)
// router.post('/validate', validateValidation, setValidation)
router.get('/all', getAllVendors);
// router.get('/:vendorCode', validateVendorCode, getVendor)

export default router;
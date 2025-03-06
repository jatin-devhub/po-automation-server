"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendor_validators_1 = require("../validators/vendor.validators");
const vendor_controller_1 = require("../controllers/vendor.controller");
const router = (0, express_1.Router)();
// router.post('/new', validateNew, vendorRegistration);
router.post('/new-start', vendor_validators_1.validateNewStart, vendor_controller_1.vendorRegistrationStart);
// router.put('/update-details/:vendorCode', validateUpdatedVendorDetails, updateVendorDetails);
// router.put('/update/:vendorCode', validateUpdate, updateVendor)
// router.post('/validate', validateValidation, setValidation)
router.get('/all', vendor_controller_1.getAllVendors);
// router.get('/:vendorCode', validateVendorCode, getVendor)
exports.default = router;

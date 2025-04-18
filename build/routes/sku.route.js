"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sku_validators_1 = require("../validators/sku.validators");
const sku_controller_1 = require("../controllers/sku.controller");
const router = (0, express_1.Router)();
router.post('/new/:vendorCode', sku_validators_1.validateVendorCode, sku_validators_1.validateNew, sku_controller_1.newSKU);
router.get('/unverified/:vendorCode', sku_validators_1.validateVendorCode, sku_controller_1.getUnverifiedSKUs);
// router.post('/review', validateReview, applyReview)
exports.default = router;

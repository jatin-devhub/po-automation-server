"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendor_validators_1 = require("../validators/vendor.validators");
const vendor_controller_1 = require("../controllers/vendor.controller");
const router = (0, express_1.Router)();
router.post('/new', vendor_validators_1.validateNew, vendor_controller_1.vendorRegistration);
exports.default = router;

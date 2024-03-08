"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reconcillation_controller_1 = require("../controllers/reconcillation.controller");
const buying_order_validators_1 = require("../validators/buying-order.validators");
const router = (0, express_1.Router)();
router.get('/approved-pos', reconcillation_controller_1.getApprovedPOs);
router.get('/:poCode', buying_order_validators_1.validatePOCode, reconcillation_controller_1.getPODetailsForReconcillation);
exports.default = router;

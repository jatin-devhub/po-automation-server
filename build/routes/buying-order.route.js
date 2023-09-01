"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const buying_order_validators_1 = require("../validators/buying-order.validators");
const buying_order_controller_1 = require("../controllers/buying-order.controller");
const router = (0, express_1.Router)();
router.post('/new', buying_order_validators_1.validateNew, buying_order_controller_1.newBuyingOrder);
exports.default = router;

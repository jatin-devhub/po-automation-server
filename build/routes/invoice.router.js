"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_validators_1 = require("../validators/invoice.validators");
const invoice_controller_1 = require("../controllers/invoice.controller");
const router = (0, express_1.Router)();
router.post("/new", invoice_validators_1.validateNewInvoice, invoice_controller_1.newInvoice);
exports.default = router;

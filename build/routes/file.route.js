"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_validators_1 = require("../validators/file.validators");
const file_controller_1 = require("../controllers/file.controller");
const router = (0, express_1.Router)();
router.get('/:fileId', file_validators_1.validateFileId, file_controller_1.getFile);
exports.default = router;

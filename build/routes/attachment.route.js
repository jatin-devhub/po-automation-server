"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attachment_validators_1 = require("../validators/attachment.validators");
const attachment_controller_1 = require("../controllers/attachment.controller");
const router = (0, express_1.Router)();
router.post('/init', attachment_validators_1.validateAttachmentInit, attachment_controller_1.uploadAttachmentsInit);
router.post('/uploadChunk', attachment_validators_1.validateUploadChunk, attachment_controller_1.uploadChunk);
router.get('/chunk/:attachmentId/:chunkIndex', attachment_validators_1.validateGetChunk, attachment_controller_1.getChunk);
// router.get('/:idType/:id', validateGetFile, getFile);
// router.put('/:idType', validateUpdateFile, updateFile);
// router.put('/:idType/:referenceIdType/:referenceId')
// router.post('/:idType', validateNewFile, newFile);
exports.default = router;

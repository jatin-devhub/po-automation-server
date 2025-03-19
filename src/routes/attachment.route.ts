import { Router } from "express";
import { validateAttachmentInit, validateGetChunk, validateUploadChunk } from "../validators/attachment.validators";
import { getChunk, uploadAttachmentsInit, uploadChunk } from "../controllers/attachment.controller";

const router = Router();

router.post('/init', validateAttachmentInit, uploadAttachmentsInit)
router.post('/uploadChunk', validateUploadChunk, uploadChunk);
router.get('/chunk/:attachmentId/:chunkIndex', validateGetChunk, getChunk);
// router.get('/:idType/:id', validateGetFile, getFile);
// router.put('/:idType', validateUpdateFile, updateFile);
// router.put('/:idType/:referenceIdType/:referenceId')
// router.post('/:idType', validateNewFile, newFile);

export default router;
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetFile = exports.validateUploadChunk = exports.validateAttachmentInit = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAttachmentInit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const AttachmentInitSchema = joi_1.default.object({
            name: joi_1.default.string().required(),
            mimeType: joi_1.default.string().required(),
            totalSizeInBytes: joi_1.default.number().required(),
            totalChunks: joi_1.default.number().required(),
            attachmentType: joi_1.default.string().required(),
            entityName: joi_1.default.string().required(),
            entityId: joi_1.default.number().required()
        });
        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "No body found",
                data: [],
            });
        AttachmentInitSchema.validate(req.body);
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: ((_a = error.details) === null || _a === void 0 ? void 0 : _a.map((err) => err.message)) || [error.message],
        });
    }
});
exports.validateAttachmentInit = validateAttachmentInit;
const validateUploadChunk = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const chunkUploadSchema = joi_1.default.object({
            attachmentId: joi_1.default.number().required(),
            chunkIndex: joi_1.default.number().required(),
        });
        if (((_b = req.files) === null || _b === void 0 ? void 0 : _b.length) == 0)
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
                data: {},
            });
        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "No body found",
                data: [],
            });
        chunkUploadSchema.validate(req.body);
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateUploadChunk = validateUploadChunk;
const validateGetFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateVendorCode = joi_1.default.object({
            idType: joi_1.default.string().required(),
            id: joi_1.default.string().required()
        });
        const value = yield validateVendorCode.validateAsync(req.params);
        next();
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateGetFile = validateGetFile;
// export const validateUpdateFile: RequestHandler = async (req, res, next) => {
//     try {
//         const updateFileBody = Joi.object({
//             attachment: Joi.any().required(), 
//             idName: Joi.string().required(), 
//             idValue: Joi.number().required()
//         })
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await updateFileBody.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }
// export const validateNewFile: RequestHandler = async (req, res, next) => {
//     try {
//         const newFileBody = Joi.object({
//             attachmentChunk: Joi.any().required(), 
//             chunkIndex: Joi.number().required(),
//             totalChunks: Joi.number().required(),
//             fileName: Joi.string().required()
//         })
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await newFileBody.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }
// export const validateNewFileChunk: RequestHandler = async (req, res, next) => {
//     try {
//         const newFileChunk = Joi.object({
//             attachmentChunk: Joi.any().required()
//         })
//         console.log('validating')
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await newFileChunk.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }

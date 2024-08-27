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
exports.validateNewFile = exports.validateUpdateFile = exports.validateGetFile = void 0;
const joi_1 = __importDefault(require("joi"));
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
const validateUpdateFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateFileBody = joi_1.default.object({
            attachment: joi_1.default.any().required(),
            idName: joi_1.default.string().required(),
            idValue: joi_1.default.number().required()
        });
        const files = req.files;
        for (const file of files) {
            req.body[file.fieldname] = file;
        }
        yield updateFileBody.validateAsync(req.body);
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
exports.validateUpdateFile = validateUpdateFile;
const validateNewFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newFileBody = joi_1.default.object({
            attachmentChunk: joi_1.default.any().required(),
            chunkIndex: joi_1.default.number().required(),
            totalChunks: joi_1.default.number().required(),
            fileName: joi_1.default.string().required()
        });
        const files = req.files;
        for (const file of files) {
            req.body[file.fieldname] = file;
        }
        yield newFileBody.validateAsync(req.body);
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
exports.validateNewFile = validateNewFile;
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

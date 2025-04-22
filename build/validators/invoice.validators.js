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
exports.validateNewInvoice = void 0;
const joi_1 = __importDefault(require("joi"));
const SKU_1 = __importDefault(require("../models/sku/SKU"));
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const validateNewInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newInvoiceSchema = joi_1.default.object({
            poCode: joi_1.default.string().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempPO = yield PurchaseOrder_1.default.findOne({ where: { poCode: value } });
                if (!tempPO) {
                    throw new Error("PO Code is not valid.");
                }
            })),
            invoiceDate: joi_1.default.date().required(),
            grnRecords: joi_1.default.array().items(joi_1.default.object({
                skuCode: joi_1.default.string().required()
                    .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                    const tempSKU = yield SKU_1.default.findOne({ where: { skuCode: value } });
                    if (!tempSKU) {
                        throw new Error("SKU Code is not valid.");
                    }
                })),
                receivedQty: joi_1.default.number().required(),
                damaged: joi_1.default.number().required(),
                expiryDate: joi_1.default.string()
            }))
        });
        // const files = req.files as Express.Multer.File[];
        // for (const file of files) {
        //     req.body[file.fieldname] = file
        // }
        req.body.grnRecords = JSON.parse(req.body.grnRecords);
        yield newInvoiceSchema.validateAsync(req.body);
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
exports.validateNewInvoice = validateNewInvoice;

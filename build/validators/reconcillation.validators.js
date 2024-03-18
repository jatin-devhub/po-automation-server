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
exports.validateInvoiceId = exports.validateInvoice = exports.validateGRNData = void 0;
const joi_1 = __importDefault(require("joi"));
const BOInvoices_1 = __importDefault(require("../models/BOInvoices"));
const validateGRNData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grnData = joi_1.default.object({
            comment: joi_1.default.string(),
            otherFields: joi_1.default.string()
        });
        yield grnData.validateAsync(req.body);
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
exports.validateGRNData = validateGRNData;
const validateInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = joi_1.default.object({
            invoiceAtt: joi_1.default.any().required()
        });
        const files = req.files;
        for (const file of files) {
            req.body[file.fieldname] = file;
        }
        yield invoice.validateAsync(req.body);
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
exports.validateInvoice = validateInvoice;
const validateInvoiceId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateInvoiceId = joi_1.default.object({
            invoiceId: joi_1.default.number().required()
        });
        const { invoiceId } = yield validateInvoiceId.validateAsync(req.params);
        const invoice = yield BOInvoices_1.default.findOne({ where: { id: invoiceId } });
        if (invoice)
            next();
        else {
            return res.status(404).json({
                success: false,
                message: "Invoice with this id doesn't exists",
                data: {}
            });
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateInvoiceId = validateInvoiceId;

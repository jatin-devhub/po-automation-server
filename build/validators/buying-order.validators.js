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
exports.validateReview = exports.validateNew = void 0;
const joi_1 = __importDefault(require("joi"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const validateNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBuyingOrderSchema = joi_1.default.object({
            poCode: joi_1.default.string().required(),
            currency: joi_1.default.string().required(),
            paymentTerms: joi_1.default.string(),
            estimatedDeliveryDate: joi_1.default.string(),
            records: joi_1.default.any().required(),
            vendorCode: joi_1.default.string(),
            createdBy: joi_1.default.string().email().required(),
            poAttachment: joi_1.default.any().required()
        });
        const files = req.files;
        for (const file of files) {
            req.body[file.fieldname] = file;
        }
        const value = yield newBuyingOrderSchema.validateAsync(req.body);
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
exports.validateNew = validateNew;
const validateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateVendorCode = joi_1.default.object({
            poCode: joi_1.default.string().required(),
            isValid: joi_1.default.boolean().required(),
            reason: joi_1.default.string()
        });
        const value = yield validateVendorCode.validateAsync(req.body);
        const poCode = value.poCode;
        const buyingOrder = yield BuyingOrder_1.default.findOne({ where: { poCode } });
        if (buyingOrder)
            next();
        else {
            return res.status(404).json({
                success: false,
                message: "Buying Order with this po code doesn't exists",
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
exports.validateReview = validateReview;

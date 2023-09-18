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
exports.applyReview = exports.getUnverifiedSKUs = exports.sendVerifyMail = exports.skuRegistration = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const SKU_1 = __importDefault(require("../models/SKU"));
const mail_service_1 = require("../utils/mail.service");
const sequelize_typescript_1 = require("sequelize-typescript");
const skuRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skuCode, category, brand, productTitle, hsn, ean, modelNumber, size, colorFamilyColor, productLengthCm, productBreadthCm, productHeightCm, productWeightKg, masterCartonQty, masterCartonLengthCm, masterCartonBreadthCm, masterCartonHeightCm, masterCartonWeightKg, MRP, createdBy, vendorCode } = req.body;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        const newSkU = new SKU_1.default({
            skuCode,
            category,
            brand,
            productTitle,
            hsn,
            ean,
            modelNumber,
            size,
            colorFamilyColor,
            productLengthCm,
            productBreadthCm,
            productHeightCm,
            productWeightKg,
            masterCartonQty,
            masterCartonLengthCm,
            masterCartonBreadthCm,
            masterCartonHeightCm,
            masterCartonWeightKg,
            MRP,
            createdBy,
            vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id
        });
        const sku = yield newSkU.save();
        if (sku)
            return res.status(201).json({
                success: true,
                message: `Your SKU has been successfully added`,
                data: [],
            });
        return res.status(404).json({
            success: false,
            message: `Some error occured in sku.controller.js -> skuRegistration`
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> skuRegistration"
            },
        });
    }
});
exports.skuRegistration = skuRegistration;
const sendVerifyMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorCode } = req.body;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        const variables = {
            "companyName": vendor === null || vendor === void 0 ? void 0 : vendor.companyName
        };
        const mailSent = yield (0, mail_service_1.sendMailSetup)(vendorCode, 'new-skus', variables, undefined);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Mail has been sent successfully`,
                data: [],
            });
        return res.status(404).json({
            success: false,
            message: `Unable to send email.`,
            data: {
                mailSent
            }
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> sendVerifyMail"
            },
        });
    }
});
exports.sendVerifyMail = sendVerifyMail;
const getUnverifiedSKUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        const skus = yield SKU_1.default.findAll({ attributes: [[sequelize_typescript_1.Sequelize.col('skuCode'), 'SKU'], [sequelize_typescript_1.Sequelize.col('category'), 'Category'], [sequelize_typescript_1.Sequelize.col('brand'), 'Brand'], [sequelize_typescript_1.Sequelize.col('productTitle'), 'Product Title'], [sequelize_typescript_1.Sequelize.col('hsn'), 'HSN'], [sequelize_typescript_1.Sequelize.col('ean'), 'EAN'], [sequelize_typescript_1.Sequelize.col('modelNumber'), 'Model Number'], [sequelize_typescript_1.Sequelize.col('size'), 'Size'], [sequelize_typescript_1.Sequelize.col('colorFamilyColor'), 'Color Family-Color'], [sequelize_typescript_1.Sequelize.col('productLengthCm'), 'Prdct L(cm)'], [sequelize_typescript_1.Sequelize.col('productBreadthCm'), 'Prdct B(cm)'], [sequelize_typescript_1.Sequelize.col('productHeightCm'), 'Prdct H(cm)'], [sequelize_typescript_1.Sequelize.col('productWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('masterCartonQty'), 'MSTRCTN Box Qty'], [sequelize_typescript_1.Sequelize.col('masterCartonLengthCm'), 'MSTRCTN L(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonBreadthCm'), 'MSTRCTN B(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonHeightCm'), 'MSTRCTN H(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('mrp'), 'MRP']], where: { isVerified: false, vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        return res.status(201).json({
            success: true,
            message: `Your unverified skus are`,
            data: {
                skus
            },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> sendVerifyMail"
            },
        });
    }
});
exports.getUnverifiedSKUs = getUnverifiedSKUs;
const applyReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorCode, isValid, reason } = req.body;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        const sku = yield SKU_1.default.findOne({ where: { isVerified: false, vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        if (isValid == "true") {
            const variables = {
                company: vendor === null || vendor === void 0 ? void 0 : vendor.companyName
            };
            yield (0, mail_service_1.sendMailSetup)(null, 'skus-success', variables, sku === null || sku === void 0 ? void 0 : sku.createdBy);
            yield SKU_1.default.update({ isVerified: true }, { where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        }
        else {
            const variables = {
                denyReason: reason
            };
            yield (0, mail_service_1.sendMailSetup)(null, 'skus-fail', variables, sku === null || sku === void 0 ? void 0 : sku.createdBy);
            yield SKU_1.default.destroy({ where: { isVerified: false, vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        }
        return res.status(201).json({
            success: true,
            message: `Your review is done`,
            data: {},
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> applyReview"
            },
        });
    }
});
exports.applyReview = applyReview;

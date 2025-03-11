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
exports.getUnverifiedSKUs = exports.sendVerifyMail = exports.newSKU = void 0;
const Vendor_1 = __importDefault(require("../models/vendor/Vendor"));
const SKU_1 = __importDefault(require("../models/sku/SKU"));
const mail_service_1 = require("../utils/mail.service");
const sequelize_typescript_1 = require("sequelize-typescript");
const connection_1 = __importDefault(require("../db/connection"));
const SKUDetails_1 = __importDefault(require("../models/sku/SKUDetails"));
const SKUDimensions_1 = __importDefault(require("../models/sku/SKUDimensions"));
const newSKU = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { createdBy, skus } = req.body;
        const skuJSON = JSON.parse(skus);
        const vendorCode = req.params.vendorCode;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }
        const transaction = yield connection_1.default.transaction();
        yield SKU_1.default.bulkCreate(skuJSON.map((sku) => ({
            skuCode: sku.skuCode,
            name: sku.productTitle,
            ean: typeof sku.ean === 'number' && !isNaN(sku.ean) ? sku.ean.toString() : sku.ean,
            vendorId: vendor.id,
        })), { transaction });
        console.log('SKUs inserted');
        // 2. Retrieve inserted SKUs using unique skuCode
        const insertedSkus = yield SKU_1.default.findAll({
            where: { skuCode: skuJSON.map((sku) => sku.skuCode) },
            transaction,
        });
        const skuMap = new Map(insertedSkus.map(sku => [sku.skuCode, sku]));
        console.log('skuMap', skuMap);
        // 3. Bulk insert SKUDetails
        const skuDetailsData = skuJSON.map((sku) => ({
            category: sku.category,
            subCategory: sku.subCategory,
            hsn: String(sku.hsn),
            modelNumber: sku.modelNumber,
            MRP: sku.MRP,
            isVerified: false,
            createdBy: createdBy || 'system',
            skuId: skuMap.get(sku.skuCode).id,
        }));
        yield SKUDetails_1.default.bulkCreate(skuDetailsData, { transaction });
        // 4. Retrieve inserted SKUDetails for dimensions linking
        const insertedDetails = yield SKUDetails_1.default.findAll({
            where: { skuId: insertedSkus.map(sku => sku.id) },
            transaction,
        });
        const detailsMap = new Map(insertedDetails.map(detail => [detail.skuId, detail]));
        // 5. Bulk insert SKUDimensions
        const skuDimensionsData = skuJSON.map((sku) => {
            const skuId = skuMap.get(sku.skuCode).id;
            return {
                size: sku.size,
                colorFamilyColor: sku.colorFamilyColor,
                productLengthCm: sku.productLengthCm,
                productBreadthCm: sku.productBreadthCm,
                productHeightCm: sku.productHeightCm,
                productWeightKg: sku.productWeightKg,
                masterCartonQty: sku.masterCartonQty,
                masterCartonLengthCm: sku.masterCartonLengthCm,
                masterCartonBreadthCm: sku.masterCartonBreadthCm,
                masterCartonHeightCm: sku.masterCartonHeightCm,
                masterCartonWeightKg: sku.masterCartonWeightKg,
                skuDetailsId: detailsMap.get(skuId).id,
            };
        });
        yield SKUDimensions_1.default.bulkCreate(skuDimensionsData, { transaction });
        yield transaction.commit();
        // const variables = {
        //     "companyName": vendor?.companyName
        // }
        // const mailSent = await sendMailSetup(vendorCode, 'new-skus', variables, undefined);
        // if (mailSent)
        return res.status(201).json({
            success: true,
            message: `${skuJSON.length} SKUs have been successfully added.`,
            data: [],
        });
        // return res.status(404).json({
        //     success: false,
        //     message: `Unable to send email.`,
        //     data: {
        //         mailSent
        //     }
        // })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.newSKU = newSKU;
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
        const skus = yield SKU_1.default.findAll({ attributes: [[sequelize_typescript_1.Sequelize.col('skuCode'), 'SKU'], [sequelize_typescript_1.Sequelize.col('category'), 'Category'], [sequelize_typescript_1.Sequelize.col('subCategory'), 'SubCategory'], [sequelize_typescript_1.Sequelize.col('brand'), 'Brand'], [sequelize_typescript_1.Sequelize.col('productTitle'), 'Product Title'], [sequelize_typescript_1.Sequelize.col('hsn'), 'HSN'], [sequelize_typescript_1.Sequelize.col('ean'), 'EAN'], [sequelize_typescript_1.Sequelize.col('modelNumber'), 'Model Number'], [sequelize_typescript_1.Sequelize.col('size'), 'Size'], [sequelize_typescript_1.Sequelize.col('colorFamilyColor'), 'Color Family-Color'], [sequelize_typescript_1.Sequelize.col('productLengthCm'), 'Prdct L(cm)'], [sequelize_typescript_1.Sequelize.col('productBreadthCm'), 'Prdct B(cm)'], [sequelize_typescript_1.Sequelize.col('productHeightCm'), 'Prdct H(cm)'], [sequelize_typescript_1.Sequelize.col('productWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('masterCartonQty'), 'MSTRCTN Box Qty'], [sequelize_typescript_1.Sequelize.col('masterCartonLengthCm'), 'MSTRCTN L(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonBreadthCm'), 'MSTRCTN B(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonHeightCm'), 'MSTRCTN H(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('mrp'), 'MRP']], where: { isVerified: false, vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
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
// export const applyReview: RequestHandler = async (req, res) => {
//     try {
//         const { vendorCode, isValid, reason } = req.body;
//         const vendor = await Vendor.findOne({ where: { vendorCode } })
//         const sku = await SKU.findOne({ where: { isVerified: false, vendorId: vendor?.id } })
//         if (isValid == "true") {
//             const variables = {
//                 company: vendor?.companyName
//             }
//             await sendMailSetup(null, 'skus-success', variables, sku?.createdBy)
//             await SKU.update(
//                 { isVerified: true },
//                 { where: { vendorId: vendor?.id } }
//             );
//         }
//         else {
//             const variables = {
//                 denyReason: reason
//             }
//             await sendMailSetup(null, 'skus-fail', variables, sku?.createdBy)
//             await SKU.destroy({ where: { isVerified: false, vendorId: vendor?.id } })
//         }
//         return res.status(201).json({
//             success: true,
//             message: `Your review is done`,
//             data: {},
//         });
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: {
//                 "source": "sku.controller.js -> applyReview"
//             },
//         });
//     }
// }

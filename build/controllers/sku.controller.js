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
exports.skuRegistration = void 0;
const Vendor_1 = require("../models/Vendor");
const SKU_1 = __importDefault(require("../models/SKU"));
const skuRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skuCode, category, brand, productTitle, hsn, ean, modelNumber, size, colorFamilyColor, productLengthCm, productBreadthCm, productHeightCm, productWeightKg, masterCartonQty, masterCartonLengthCm, masterCartonBreadthCm, masterCartonHeightCm, masterCartonWeightKg, MRP, vendorCode } = req.body;
        const vendor = yield Vendor_1.Vendor.findOne({ where: { vendorCode } });
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
// export const getAllVendors: RequestHandler = async (req, res) => {
//     try {
//         const vendors = await Vendor.findAll({
//             attributes: ['vendorCode', 'companyName', [Sequelize.col('address.state'), 'state'], [Sequelize.col('address.country'), 'country'], 'productCategory'],
//             include: [
//                 {
//                   model: VendorAddress,
//                   attributes: [],
//                 },
//               ]
//         });
//         return res.status(201).json({
//             success: true,
//             message: `Vendors data successfully fetched`,
//             data: {vendors},
//         });
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: {
//                 "source": "vendor.controller.js -> getAllVendors"
//             },
//         });
//     }
// };

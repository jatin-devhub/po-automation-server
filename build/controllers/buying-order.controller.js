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
exports.newBuyingOrder = void 0;
const Vendor_1 = require("../models/Vendor");
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const SKU_1 = __importDefault(require("../models/SKU"));
const newBuyingOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currency, paymentTerms, estimatedDeliveryDate, records, vendorCode } = req.body;
        const vendor = yield Vendor_1.Vendor.findOne({ where: { vendorCode } });
        const poCode = yield getUniquePOCode();
        const newBuyingOrder = new BuyingOrder_1.default({
            poCode,
            currency,
            paymentTerms,
            estimatedDeliveryDate,
            vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id
        });
        const buyingOrder = yield newBuyingOrder.save();
        if (buyingOrder) {
            const recordsObject = JSON.parse(records);
            for (let i = 0; i < recordsObject.length; i++) {
                const { skuCode, expectedQty, unitCost, gst } = recordsObject[i];
                const sku = yield SKU_1.default.findOne({ where: { skuCode } });
                const newBuyingOrderRecord = new BuyingOrderRecord_1.default({
                    expectedQty,
                    unitCost,
                    gst,
                    buyingOrderId: buyingOrder.id,
                    skuId: sku === null || sku === void 0 ? void 0 : sku.id
                });
                const buyingOrderRecord = yield newBuyingOrderRecord.save();
            }
        }
        return res.status(201).json({
            success: true,
            message: `Your BuyingOrder has been successfully added`,
            data: { buyingOrder },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "buying-order.controller.js -> newBuyingOrder"
            },
        });
    }
});
exports.newBuyingOrder = newBuyingOrder;
const getUniquePOCode = () => __awaiter(void 0, void 0, void 0, function* () {
    let poCode, existingPO;
    do {
        poCode = `PO${Math.floor(1000 + Math.random() * 9000)}`;
        existingPO = yield BuyingOrder_1.default.findOne({
            where: {
                poCode,
            },
        });
    } while (existingPO);
    return poCode;
});
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

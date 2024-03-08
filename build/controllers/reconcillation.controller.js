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
exports.getPODetailsForReconcillation = exports.getApprovedPOs = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const sequelize_1 = require("sequelize");
const SKU_1 = __importDefault(require("../models/SKU"));
const getApprovedPOs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buyingOrders = yield BuyingOrder_1.default.findAll({
            where: { isVerified: true },
            attributes: ['id', 'poCode', [sequelize_1.Sequelize.col('vendor.vendorCode'), 'vendorCode'], [sequelize_1.Sequelize.col('vendor.companyName'), 'vendorName']],
            include: [
                {
                    model: Vendor_1.default,
                },
                {
                    model: BuyingOrderRecord_1.default
                }
            ]
        });
        const transformedBuyingOrders = [];
        for (let i = 0; i < buyingOrders.length; i++) {
            const buyingOrder = buyingOrders[i];
            const transformedBuyingOrder = {
                id: buyingOrder.id,
                poCode: buyingOrder.poCode,
                vendorCode: buyingOrder.vendor.vendorCode,
                vendorName: buyingOrder.vendor.companyName,
                units: buyingOrder.records.reduce((sum, record) => sum + record.expectedQty, 0),
                amount: buyingOrder.records.reduce((sum, record) => {
                    const costPerUnit = parseFloat(record.unitCost);
                    const gstPercentage = parseFloat(record.gst) / 100;
                    const totalCostPerItem = costPerUnit + (costPerUnit * gstPercentage);
                    return sum + (totalCostPerItem * record.expectedQty);
                }, 0),
                status: buyingOrder.closed ? 'closed' : 'open'
            };
            transformedBuyingOrders.push(transformedBuyingOrder);
        }
        return res.status(201).json({
            success: true,
            message: `Your pos have been fetched`,
            data: { pos: transformedBuyingOrders },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> getApprovedPOs"
            },
        });
    }
});
exports.getApprovedPOs = getApprovedPOs;
const getPODetailsForReconcillation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poCode } = req.params;
        const buyingOrder = yield BuyingOrder_1.default.findOne({
            where: { poCode }, include: [
                {
                    model: Vendor_1.default,
                }
            ]
        });
        const poRecords = yield BuyingOrderRecord_1.default.findAll({
            where: { buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id },
            attributes: [[sequelize_1.Sequelize.col('sku.skuCode'), 'skuCode'], [sequelize_1.Sequelize.col('sku.productTitle'), 'productTitle'], [sequelize_1.Sequelize.col('sku.category'), 'category'], [sequelize_1.Sequelize.col('sku.brand'), 'brand'], [sequelize_1.Sequelize.col('sku.colorFamilyColor'), 'colorFamilyColor'], [sequelize_1.Sequelize.col('expectedQty'), 'eQty'], 'unitCost', [sequelize_1.Sequelize.literal('(`unitCost` * `gst`) / 100'), 'totalGST'], 'gst'],
            include: [
                {
                    model: SKU_1.default
                }
            ]
        });
        // const poFile = await File.findOne({ where: { buyingOrderId: buyingOrder?.id } }) || undefined
        // const vendor = await Vendor.findOne({where: {}})
        return res.status(201).json({
            success: true,
            message: `Your details have been fetched`,
            data: { buyingOrder, poRecords },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> getPODetailsForReconcillation"
            },
        });
    }
});
exports.getPODetailsForReconcillation = getPODetailsForReconcillation;

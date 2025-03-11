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
exports.deleteInvoice = exports.updateInvoice = exports.newInvoice = exports.updateGRNData = exports.getPODetailsForReconcillation = exports.getAllPOs = exports.getApprovedPOs = void 0;
const Vendor_1 = __importDefault(require("../models/vendor/Vendor"));
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const sequelize_1 = require("sequelize");
const SKU_1 = __importDefault(require("../models/sku/SKU"));
const BuyingOrderOther_1 = __importDefault(require("../models/BuyingOrderOther"));
const BOInvoices_1 = __importDefault(require("../models/BOInvoices"));
const File_1 = __importDefault(require("../models/File"));
const getApprovedPOs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buyingOrders = yield PurchaseOrder_1.default.findAll({
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
const getAllPOs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buyingOrders = yield PurchaseOrder_1.default.findAll({
            attributes: ['id', 'poCode', [sequelize_1.Sequelize.col('vendor.vendorCode'), 'vendorCode'], [sequelize_1.Sequelize.col('vendor.companyName'), 'vendorName'], 'isVerified', 'closed'],
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
                status: buyingOrder.isVerified ? (buyingOrder.closed ? 'Closed' : 'Open') : 'Unverified'
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
exports.getAllPOs = getAllPOs;
const getPODetailsForReconcillation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poCode } = req.params;
        const buyingOrder = yield PurchaseOrder_1.default.findOne({
            where: { poCode }, include: [
                {
                    model: Vendor_1.default,
                },
                {
                    model: BOInvoices_1.default
                },
                {
                    model: BuyingOrderOther_1.default
                }
            ]
        });
        const poRecords = yield BuyingOrderRecord_1.default.findAll({
            where: { buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id },
            attributes: [[sequelize_1.Sequelize.col('sku.skuCode'), 'skuCode'], [sequelize_1.Sequelize.col('sku.productTitle'), 'productTitle'], [sequelize_1.Sequelize.col('sku.category'), 'category'], [sequelize_1.Sequelize.col('sku.brand'), 'brand'], [sequelize_1.Sequelize.col('sku.colorFamilyColor'), 'colorFamilyColor'], [sequelize_1.Sequelize.col('expectedQty'), 'eQty'], 'unitCost', [sequelize_1.Sequelize.literal('ROUND((`unitCost` * `gst`) / 100, 2)'), 'totalGST'], 'gst'],
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
const updateGRNData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { comment, otherFields } = req.body;
        const { poCode } = req.params;
        let otherFieldsArray = otherFields ? JSON.parse(otherFields) : [];
        // Update BuyingOrder with grnComment
        yield PurchaseOrder_1.default.update({ grnComment: comment }, { where: { poCode } });
        // Retrieve the updated BuyingOrder
        const buyingOrder = yield PurchaseOrder_1.default.findOne({
            where: { poCode }
        });
        const oldOtherFields = yield BuyingOrderOther_1.default.findAll({
            where: {
                buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id
            }
        });
        yield Promise.all(oldOtherFields.filter((oldOtherField) => !otherFieldsArray.some((newOtherField) => newOtherField.key === oldOtherField.otherKey)).map((otherField) => __awaiter(void 0, void 0, void 0, function* () {
            yield BuyingOrderOther_1.default.destroy({
                where: {
                    otherKey: otherField.otherKey,
                    buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id
                }
            });
        })));
        // Use Promise.all to wait for all the create operations to complete
        const updatedOtherFieldsArray = yield Promise.all(otherFieldsArray.map((otherFieldData) => __awaiter(void 0, void 0, void 0, function* () {
            let otherField = oldOtherFields.find(oldOtherField => oldOtherField.otherKey === otherFieldData.key);
            if (otherField) {
                yield BuyingOrderOther_1.default.update({
                    otherValue: otherFieldData.value
                }, {
                    where: {
                        otherKey: otherFieldData.key,
                        buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id
                    }
                });
            }
            else
                otherField = yield BuyingOrderOther_1.default.create({
                    otherKey: otherFieldData.key,
                    otherValue: otherFieldData.value,
                    buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id,
                });
            return Object.assign(Object.assign({}, otherFieldData), { id: otherField.id });
        })));
        // Return success response with updated other fields
        return res.status(201).json({
            success: true,
            message: 'GRN Data updated successfully',
            data: {
                otherFields: updatedOtherFieldsArray,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconciliation.controller.js -> updateGRNData",
            },
        });
    }
});
exports.updateGRNData = updateGRNData;
const newInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poId } = req.params;
        const { invoiceAtt } = req.body;
        const boInvoice = yield BOInvoices_1.default.create({
            buyingOrderId: poId
        });
        const decodedInvoiceAtt = Buffer.from(invoiceAtt.buffer, 'base64');
        yield File_1.default.create({
            fileName: invoiceAtt.originalname,
            fileContent: decodedInvoiceAtt,
            fileType: 'invoiceAtt',
            invoiceAttId: boInvoice.id
        });
        yield PurchaseOrder_1.default.update({
            closed: true
        }, {
            where: { id: poId }
        });
        return res.status(201).json({
            success: true,
            message: 'Invoice successfully added',
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> newInvoice"
            },
        });
    }
});
exports.newInvoice = newInvoice;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceAtt } = req.body;
        const { invoiceId } = req.params;
        const decodedInvoiceAtt = Buffer.from(invoiceAtt.buffer, 'base64');
        yield File_1.default.update({
            fileName: invoiceAtt.originalname,
            fileContent: decodedInvoiceAtt
        }, {
            where: {
                fileType: 'invoiceAtt',
                invoiceAttId: invoiceId
            }
        });
        return res.status(201).json({
            success: true,
            message: 'Invoice successfully updated',
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> updateInvoice"
            },
        });
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceId } = req.params;
        yield File_1.default.destroy({
            where: {
                fileType: 'invoiceAtt',
                invoiceAttId: invoiceId
            }
        });
        yield BOInvoices_1.default.destroy({
            where: {
                id: invoiceId
            }
        });
        return res.status(201).json({
            success: true,
            message: 'Invoice successfully deleted',
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> updateInvoice"
            },
        });
    }
});
exports.deleteInvoice = deleteInvoice;

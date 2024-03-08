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
exports.getPODetails = exports.applyReview = exports.getUniquePOCodeRoute = exports.newBuyingOrder = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const SKU_1 = __importDefault(require("../models/SKU"));
const File_1 = __importDefault(require("../models/File"));
const mail_service_1 = require("../utils/mail.service");
const VendorAddress_1 = __importDefault(require("../models/VendorAddress"));
const newBuyingOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poCode, currency, paymentTerms, estimatedDeliveryDate, records, vendorCode, createdBy, poAttachment } = req.body;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        const decodedPOFile = Buffer.from(poAttachment.buffer, 'base64');
        const newBuyingOrder = new BuyingOrder_1.default({
            poCode,
            currency,
            paymentTerms,
            estimatedDeliveryDate,
            createdBy,
            verificationLevel: 'Buyer',
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
        const poFile = yield File_1.default.create({
            fileName: poAttachment.originalname,
            fileContent: decodedPOFile,
            filetype: 'PO',
            buyingOrderId: buyingOrder.id
        });
        const mailSent = yield (0, mail_service_1.sendMailSetup)(buyingOrder.poCode, 'buyer-approval', undefined, undefined, poFile);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your BuyingOrder request has been successfully added`,
                data: { buyingOrder },
            });
        else
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
                "source": "buying-order.controller.js -> newBuyingOrder"
            },
        });
    }
});
exports.newBuyingOrder = newBuyingOrder;
const getUniquePOCodeRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poCode = yield getUniquePOCode();
        return res.status(201).json({
            success: true,
            message: `Your POCode has been created`,
            data: { poCode },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "buying-order.controller.js -> getUniquePOCodeRoute"
            },
        });
    }
});
exports.getUniquePOCodeRoute = getUniquePOCodeRoute;
const applyReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poCode, isValid, reason } = req.body;
        const buyingOrder = yield BuyingOrder_1.default.findOne({ where: { poCode } });
        const poFile = (yield File_1.default.findOne({ where: { buyingOrderId: buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.id } })) || undefined;
        if (isValid == "true") {
            if ((buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.verificationLevel) == "Buyer") {
                yield (0, mail_service_1.sendMailSetup)(buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.poCode, 'account-approval', undefined, undefined, poFile);
                yield BuyingOrder_1.default.update({ verificationLevel: 'Accounts' }, { where: { poCode } });
            }
            else if ((buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.verificationLevel) == "Accounts") {
                yield (0, mail_service_1.sendMailSetup)(buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.poCode, 'bu-approval', undefined, undefined, poFile);
                yield BuyingOrder_1.default.update({ verificationLevel: 'BOHead' }, { where: { poCode } });
            }
            else if ((buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.verificationLevel) == "BOHead") {
                yield (0, mail_service_1.sendMailSetup)(null, 'po-success', undefined, buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.createdBy);
                yield BuyingOrder_1.default.update({ isVerified: true }, { where: { poCode } });
            }
        }
        else {
            const variables = {
                denyReason: reason
            };
            yield (0, mail_service_1.sendMailSetup)(null, 'po-fail', variables, buyingOrder === null || buyingOrder === void 0 ? void 0 : buyingOrder.createdBy);
            yield BuyingOrder_1.default.destroy({ where: { isVerified: false, poCode } });
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
const getPODetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { poCode } = req.params;
        const buyingOrder = yield BuyingOrder_1.default.findOne({
            where: { poCode }, include: [
                {
                    model: Vendor_1.default,
                    include: [
                        {
                            model: VendorAddress_1.default
                        }
                    ]
                }
            ]
        });
        // const poFile = await File.findOne({ where: { buyingOrderId: buyingOrder?.id } }) || undefined
        // const vendor = await Vendor.findOne({where: {}})
        return res.status(201).json({
            success: true,
            message: `Your details have been fetched`,
            data: { buyingOrder },
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
exports.getPODetails = getPODetails;
const getUniquePOCode = () => __awaiter(void 0, void 0, void 0, function* () {
    let poCode, existingPO;
    do {
        poCode = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
        existingPO = yield BuyingOrder_1.default.findOne({
            where: {
                poCode,
            },
        });
    } while (existingPO);
    return poCode;
});

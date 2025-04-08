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
exports.getInventory = void 0;
const SKU_1 = __importDefault(require("../models/sku/SKU"));
const SKUDetails_1 = __importDefault(require("../models/sku/SKUDetails"));
const Inventory_1 = __importDefault(require("../models/sku/Inventory"));
const getInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skus = yield SKU_1.default.findAll({
            include: [
                {
                    model: SKUDetails_1.default,
                    required: true, // ensures SKUDetails is fetched
                },
                {
                    model: Inventory_1.default,
                    required: false, // inventory might be empty
                },
            ],
        });
        const inventory = skus.map(sku => {
            const details = sku.details;
            return {
                "SKU Code": sku.skuCode,
                "Category": details ? details.category : null,
                "Product Title": sku.name,
                "SAP Code": details ? details.sapCode : null,
                "HSN": details ? details.hsn : null,
                "EAN": sku.ean,
                "Model Number": details ? details.modelNumber : null,
                "Current Inventory": sku.inventory ? sku.inventory.map(inv => ({
                    count: inv.quantity,
                    expiry: inv.expiry,
                })) : []
            };
        });
        return res.status(200).json({
            success: true,
            message: "Inventory retrieved successfully",
            data: { inventory }
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "inventory.controller.js -> getInventory"
            },
        });
    }
});
exports.getInventory = getInventory;

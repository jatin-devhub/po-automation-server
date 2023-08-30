"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Vendor_1 = require("../models/Vendor");
const VendorBank_1 = __importDefault(require("../models/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/VendorOther"));
const SKU_1 = __importDefault(require("../models/SKU"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const File_1 = __importDefault(require("../models/File"));
const connection = new sequelize_typescript_1.Sequelize({
    dialect: "mysql",
    host: '62.72.3.60',
    username: 'poadmin',
    password: 'po1234',
    database: 'po_automation',
    port: 3306,
    models: [Vendor_1.Vendor, VendorBank_1.default, VendorOther_1.default, SKU_1.default, BuyingOrder_1.default, BuyingOrderRecord_1.default, File_1.default]
});
// connection.truncate({ cascade: true, restartIdentity: true });
exports.default = connection;

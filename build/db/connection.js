"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Vendor_1 = __importDefault(require("../models/Vendor"));
const VendorBank_1 = __importDefault(require("../models/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/VendorOther"));
const SKU_1 = __importDefault(require("../models/SKU"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const BuyingOrderRecord_1 = __importDefault(require("../models/BuyingOrderRecord"));
const File_1 = __importDefault(require("../models/File"));
const mysql = __importStar(require("mysql2"));
const ContactPerson_1 = __importDefault(require("../models/ContactPerson"));
const VendorAddress_1 = __importDefault(require("../models/VendorAddress"));
const Comment_1 = __importDefault(require("../models/Comment"));
const BOInvoices_1 = __importDefault(require("../models/BOInvoices"));
const BuyingOrderOther_1 = __importDefault(require("../models/BuyingOrderOther"));
const FileChunk_1 = __importDefault(require("../models/FileChunk"));
const connection = new sequelize_typescript_1.Sequelize({
    dialect: "mysql",
    dialectModule: mysql,
    host: '62.72.3.60',
    username: 'poadmin',
    password: 'po1234',
    database: 'po_testing',
    // database: 'po_automation',
    port: 3306,
    models: [Vendor_1.default, ContactPerson_1.default, VendorAddress_1.default, VendorBank_1.default, VendorOther_1.default, SKU_1.default, BuyingOrder_1.default, BuyingOrderRecord_1.default, File_1.default, Comment_1.default, BOInvoices_1.default, BuyingOrderOther_1.default, FileChunk_1.default]
});
// connection.sync({ alter: true }); 
exports.default = connection;

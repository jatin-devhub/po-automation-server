"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const VendorBank_1 = __importDefault(require("./VendorBank"));
const VendorOther_1 = __importDefault(require("./VendorOther"));
const SKU_1 = __importDefault(require("./SKU"));
const BuyingOrder_1 = __importDefault(require("./BuyingOrder"));
const ContactPerson_1 = __importDefault(require("./ContactPerson"));
const VendorAddress_1 = __importDefault(require("./VendorAddress"));
const File_1 = __importDefault(require("./File"));
const Comment_1 = __importDefault(require("./Comment"));
let Vendor = class Vendor extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Vendor.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "vendorCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "productCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    })
], Vendor.prototype, "gst", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default, { foreignKey: 'gstAttVendorId' })
], Vendor.prototype, "gstAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "coi", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default, { foreignKey: 'coiAttVendorId' })
], Vendor.prototype, "coiAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "msme", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default, { foreignKey: 'msmeAttVendorId' })
], Vendor.prototype, "msmeAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "tradeMark", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default, { foreignKey: 'tradeMarkAttVendorId' })
], Vendor.prototype, "tradeMarkAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default, { foreignKey: 'agreementAttVendorId' })
], Vendor.prototype, "agreementAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN
    })
], Vendor.prototype, "isVerified", void 0);
__decorate([
    sequelize_typescript_1.IsEmail,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], Vendor.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => ContactPerson_1.default)
], Vendor.prototype, "contactPerson", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VendorAddress_1.default)
], Vendor.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VendorBank_1.default)
], Vendor.prototype, "vendorBank", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => VendorOther_1.default)
], Vendor.prototype, "otherFields", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1.default)
], Vendor.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SKU_1.default)
], Vendor.prototype, "skus", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => BuyingOrder_1.default)
], Vendor.prototype, "buyingOrders", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Vendor.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Vendor.prototype, "updatedAt", void 0);
Vendor = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'vendor'
    })
], Vendor);
exports.default = Vendor;

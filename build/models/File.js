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
const BuyingOrder_1 = __importDefault(require("./BuyingOrder"));
const SKU_1 = __importDefault(require("./SKU"));
const Vendor_1 = __importDefault(require("./Vendor"));
const VendorBank_1 = __importDefault(require("./VendorBank"));
const VendorOther_1 = __importDefault(require("./VendorOther"));
let File = class File extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], File.prototype, "fileName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BLOB('medium')
    })
], File.prototype, "fileContent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], File.prototype, "fileType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => BuyingOrder_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "buyingOrderId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SKU_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "skuId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vendor_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "vendorId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VendorBank_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "vendorBankId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VendorOther_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], File.prototype, "vendorOtherId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => BuyingOrder_1.default)
], File.prototype, "buyingOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SKU_1.default)
], File.prototype, "sku", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vendor_1.default)
], File.prototype, "vendor", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VendorBank_1.default)
], File.prototype, "vendorBank", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VendorOther_1.default)
], File.prototype, "vendorOther", void 0);
File = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'files',
    })
], File);
exports.default = File;

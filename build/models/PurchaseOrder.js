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
const BuyingOrderRecord_1 = __importDefault(require("./BuyingOrderRecord"));
const Vendor_1 = __importDefault(require("./vendor/Vendor"));
const AttachmentMapping_1 = __importDefault(require("./attachment/AttachmentMapping"));
const Invoice_1 = __importDefault(require("./Invoice"));
let PurchaseOrder = class PurchaseOrder extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], PurchaseOrder.prototype, "poCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], PurchaseOrder.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN
    })
], PurchaseOrder.prototype, "isVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], PurchaseOrder.prototype, "verificationLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'poAttachment' }
    })
], PurchaseOrder.prototype, "poAttachment", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], PurchaseOrder.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN
    })
], PurchaseOrder.prototype, "closed", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Invoice_1.default)
], PurchaseOrder.prototype, "invoices", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => BuyingOrderRecord_1.default)
], PurchaseOrder.prototype, "records", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vendor_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], PurchaseOrder.prototype, "vendorId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vendor_1.default)
], PurchaseOrder.prototype, "vendor", void 0);
PurchaseOrder = __decorate([
    sequelize_typescript_1.Table
], PurchaseOrder);
exports.default = PurchaseOrder;

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
const Vendor_1 = __importDefault(require("./Vendor"));
const ContactPerson_1 = __importDefault(require("./ContactPerson"));
const VendorAddress_1 = __importDefault(require("./VendorAddress"));
const VendorBank_1 = __importDefault(require("./VendorBank"));
const VendorOther_1 = __importDefault(require("./VendorOther"));
// import Comment from "../Comment";
const VendorAttachments_1 = __importDefault(require("./VendorAttachments"));
const Comment_1 = __importDefault(require("../Comment"));
const PurchaseOrder_1 = __importDefault(require("../PurchaseOrder"));
let VendorProfile = class VendorProfile extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], VendorProfile.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vendor_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], VendorProfile.prototype, "vendorId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN
    })
], VendorProfile.prototype, "isVerified", void 0);
__decorate([
    sequelize_typescript_1.IsEmail,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorProfile.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VendorAttachments_1.default)
], VendorProfile.prototype, "attachments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => ContactPerson_1.default)
], VendorProfile.prototype, "contactPerson", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VendorAddress_1.default)
], VendorProfile.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VendorBank_1.default)
], VendorProfile.prototype, "vendorBank", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => VendorOther_1.default)
], VendorProfile.prototype, "otherFields", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PurchaseOrder_1.default)
], VendorProfile.prototype, "purchaseOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Comment_1.default)
], VendorProfile.prototype, "comment", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vendor_1.default)
], VendorProfile.prototype, "vendor", void 0);
VendorProfile = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vendor_profile'
    })
], VendorProfile);
exports.default = VendorProfile;

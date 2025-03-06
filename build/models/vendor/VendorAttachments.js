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
const AttachmentMapping_1 = __importDefault(require("../attachment/AttachmentMapping"));
const VendorProfile_1 = __importDefault(require("./VendorProfile"));
let VendorAttachments = class VendorAttachments extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], VendorAttachments.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VendorProfile_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], VendorAttachments.prototype, "vendorProfileId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    })
], VendorAttachments.prototype, "gstId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'GST' }
    })
], VendorAttachments.prototype, "gstAttachment", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAttachments.prototype, "coiId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'COI' }
    })
], VendorAttachments.prototype, "coiAttachment", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAttachments.prototype, "msmeId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'MSME' }
    })
], VendorAttachments.prototype, "msmeAttachment", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAttachments.prototype, "tradeMarkId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'TradeMark' }
    })
], VendorAttachments.prototype, "tradeMarkAttachment", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AttachmentMapping_1.default, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'Agreement' }
    })
], VendorAttachments.prototype, "agreementAttachment", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VendorProfile_1.default)
], VendorAttachments.prototype, "vendorProfile", void 0);
VendorAttachments = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vendor_attachments'
    })
], VendorAttachments);
exports.default = VendorAttachments;

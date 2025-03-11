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
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
const SKU_1 = __importDefault(require("./sku/SKU"));
const VendorProfile_1 = __importDefault(require("./vendor/VendorProfile"));
let Comment = Comment_1 = class Comment extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    })
], Comment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    })
], Comment.prototype, "comment", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Comment_1),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Comment.prototype, "commentId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => PurchaseOrder_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Comment.prototype, "buyingOrderId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SKU_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Comment.prototype, "skuId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VendorProfile_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Comment.prototype, "vendorId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1)
], Comment.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Comment_1)
], Comment.prototype, "parentComment", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => PurchaseOrder_1.default)
], Comment.prototype, "buyingOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SKU_1.default)
], Comment.prototype, "sku", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VendorProfile_1.default)
], Comment.prototype, "vendorProfile", void 0);
Comment = Comment_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'comments',
    })
], Comment);
exports.default = Comment;

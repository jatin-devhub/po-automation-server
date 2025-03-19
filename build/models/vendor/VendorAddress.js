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
const VendorProfile_1 = __importDefault(require("./VendorProfile"));
let VendorAddress = class VendorAddress extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], VendorAddress.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "addressLine1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "addressLine2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "countryName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "countryCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "stateName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "stateCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "cityName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING
    })
], VendorAddress.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VendorProfile_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    })
], VendorAddress.prototype, "vendorProfileId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VendorProfile_1.default)
], VendorAddress.prototype, "vendorProfile", void 0);
VendorAddress = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'vendor_address',
        timestamps: true,
    })
], VendorAddress);
exports.default = VendorAddress;

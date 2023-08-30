"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Vendor_1 = require("./Vendor");
let SKU = class SKU extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], SKU.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, unique: true, type: sequelize_typescript_1.DataType.STRING })
], SKU.prototype, "skuCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING })
], SKU.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING })
], SKU.prototype, "productName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING })
], SKU.prototype, "hsn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING })
], SKU.prototype, "ean", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "mrp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'product_length_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "productLengthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'product_breadth_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "productBreadthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'product_height_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "productHeightCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'product_weight_kg', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "productWeightKg", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'master_carton_qty', type: sequelize_typescript_1.DataType.INTEGER })
], SKU.prototype, "masterCartonQty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'master_carton_length_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "masterCartonLengthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'master_carton_breadth_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "masterCartonBreadthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'master_carton_height_cm', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "masterCartonHeightCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, field: 'master_carton_weight_kg', type: sequelize_typescript_1.DataType.FLOAT })
], SKU.prototype, "masterCartonWeightKg", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vendor_1.Vendor),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })
], SKU.prototype, "vendorId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vendor_1.Vendor)
], SKU.prototype, "vendor", void 0);
SKU = __decorate([
    sequelize_typescript_1.Table
], SKU);
exports.default = SKU;

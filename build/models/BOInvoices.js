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
const File_1 = __importDefault(require("./File"));
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
let BOInvoices = class BOInvoices extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], BOInvoices.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => File_1.default)
], BOInvoices.prototype, "invoiceAtt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => PurchaseOrder_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    })
], BOInvoices.prototype, "buyingOrderId", void 0);
BOInvoices = __decorate([
    sequelize_typescript_1.Table
], BOInvoices);
exports.default = BOInvoices;

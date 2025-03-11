"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendor_route_1 = __importDefault(require("./vendor.route"));
const sku_route_1 = __importDefault(require("./sku.route"));
// import buyingOrderRouter from "./buying-order.route"
const attachment_route_1 = __importDefault(require("./attachment.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
// import reconcillationRouter from "./reconcillation.route"
const invoice_router_1 = __importDefault(require("./invoice.router"));
const util_route_1 = __importDefault(require("./util.route"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.status(200).send("Api is working");
});
router.use("/vendor", vendor_route_1.default);
router.use("/sku", sku_route_1.default);
// router.use("/buying-order", buyingOrderRouter)
router.use("/attachment", attachment_route_1.default);
router.use("/auth", auth_route_1.default);
// router.use("/reconcillation", reconcillationRouter)
router.use("/invoice", invoice_router_1.default);
router.use("/utils", util_route_1.default);
exports.default = router;

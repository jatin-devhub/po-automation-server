import { Router } from "express";

import vendorRouter from "./vendor.route"
import skuRouter from "./sku.route"
import inventoryRouter from "./inventory.route"
import purchaseOrderRouter from "./purchase-order.route"
import attachmentRoute from "./attachment.route"
import authRouter from "./auth.route"
// import reconcillationRouter from "./reconcillation.route"
import invoiceRouter from "./invoice.router"
import utilRouter from "./util.route"

const router = Router();

router.get("/", (req, res) => {
	res.status(200).send("Api is working");
});

router.use("/vendor", vendorRouter)
router.use("/sku", skuRouter)
router.use("/inventory", inventoryRouter);
router.use("/purchase-order", purchaseOrderRouter)
router.use("/attachment", attachmentRoute)
router.use("/auth", authRouter)
// router.use("/reconcillation", reconcillationRouter)
router.use("/invoice", invoiceRouter)
router.use("/utils", utilRouter)

export default router;
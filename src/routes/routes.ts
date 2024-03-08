import { Router } from "express";

import vendorRouter from "./vendor.route"
import skuRouter from "./sku.route"
import buyingOrderRouter from "./buying-order.route"
import fileRouter from "./file.route"
import authRouter from "./auth.route"
import reconcillationRouter from "./reconcillation.route"

const router = Router();

router.get("/", (req, res) => {
	res.status(200).send("Api is working");
});

router.use("/vendor", vendorRouter)
router.use("/sku", skuRouter)
router.use("/buying-order", buyingOrderRouter)
router.use("/file", fileRouter)
router.use("/auth", authRouter)
router.use("/reconcillation", reconcillationRouter)

export default router;
import { Router } from "express";

import vendorRouter from "./vendor.route"
import skuRouter from "./sku.route"

const router = Router();

router.get("/", (req, res) => {
	res.status(200).send("Api is working");
});

router.use("/vendor", vendorRouter)
router.use("/sku", skuRouter)

export default router;
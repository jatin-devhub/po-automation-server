import { Router } from "express";

import vendorRouter from "./vendor.route"

const router = Router();

router.get("/", (req, res) => {
	res.status(200).send("Api is working");
});

router.use("/vendor", vendorRouter)

export default router;
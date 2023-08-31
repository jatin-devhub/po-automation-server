import { Router } from "express";
import { validateNew } from "../validators/vendor.validators";
import { getAllVendors, vendorRegistration } from "../controllers/vendor.controller";

const router = Router();

router.post('/new', validateNew, vendorRegistration);
router.get('/all', getAllVendors);

export default router;
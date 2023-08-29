import { Router } from "express";
import { validateNew } from "../validators/vendor.validators";
import { vendorRegistration } from "../controllers/vendor.controller";

const router = Router();

router.post('/new', validateNew, vendorRegistration);

export default router;
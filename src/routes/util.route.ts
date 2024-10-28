import { Router } from "express";
import { getCities, getCountries, getStates } from "../controllers/util.controller";
import { validateGetCities, validateGetStates } from "../validators/util.validator";

const router = Router();

router.get('/countries', getCountries);
router.get('/states', validateGetStates, getStates);
router.get('/cities', validateGetCities, getCities);

export default router;
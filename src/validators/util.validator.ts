import { RequestHandler } from "express";
import Joi from "joi";

export const validateGetStates: RequestHandler = async (req, res, next) => {
    try {
        const getStatesValidator = Joi.object({
            country_code: Joi.string().length(2).uppercase().required()
        })
        await getStatesValidator.validateAsync(req.query);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const validateGetCities: RequestHandler = async (req, res, next) => {
    try {
        const getCitiesValidator = Joi.object({
            state_code: Joi.string().min(2).max(3).uppercase().required()
        })
        await getCitiesValidator.validateAsync(req.query);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
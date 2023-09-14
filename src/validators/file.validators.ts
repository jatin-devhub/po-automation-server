import { RequestHandler } from "express";
import Joi from "joi";
import File from "../models/File";

export const validateGetFile: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            idType: Joi.string().required(),
            id: Joi.string().required()
        })

        const value = await validateVendorCode.validateAsync(req.params);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}
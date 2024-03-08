import { RequestHandler } from "express";
import Joi from "joi";
import BuyingOrder from "../models/BuyingOrder";

export const validateNew: RequestHandler = async (req, res, next) => {
    try {
        const newBuyingOrderSchema = Joi.object({
            poCode: Joi.string().required(),
            currency: Joi.string().required(),
            paymentTerms: Joi.string(),
            estimatedDeliveryDate: Joi.string(),
            records: Joi.any().required(),
            vendorCode: Joi.string(),
            createdBy: Joi.string().email().required(),
            poAttachment: Joi.any().required()
        });
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
            req.body[file.fieldname] = file
        }
        const value = await newBuyingOrderSchema.validateAsync(req.body);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateReview: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            poCode: Joi.string().required(),
            isValid: Joi.boolean().required(),
            reason: Joi.string()
        });

        const value = await validateVendorCode.validateAsync(req.body);
        const poCode = value.poCode;
        const buyingOrder = await BuyingOrder.findOne({ where: { poCode } })
        if(buyingOrder)
        next();
        else {
            return res.status(404).json({
                success: false,
                message: "Buying Order with this po code doesn't exists",
                data: {}
            })
        }

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validatePOCode: RequestHandler = async (req, res, next) => {
    try {
        const validatePOCode = Joi.object({
            poCode: Joi.string().required()
        });

        const value = await validatePOCode.validateAsync(req.params);
        const poCode = value.poCode;
        const buyingOrder = await BuyingOrder.findOne({ where: { poCode } })
        if(buyingOrder)
        next();
        else {
            return res.status(404).json({
                success: false,
                message: "Buying Order with this po code doesn't exists",
                data: {}
            })
        }

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}
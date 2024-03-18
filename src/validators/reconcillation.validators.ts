import { RequestHandler } from "express";
import Joi from "joi";
import BOInvoices from "../models/BOInvoices";

export const validateGRNData: RequestHandler = async (req, res, next) => {
    try {
        const grnData = Joi.object({
            comment: Joi.string(),
            otherFields: Joi.string()
        });
        await grnData.validateAsync(req.body);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateInvoice: RequestHandler = async (req, res, next) => {
    try {
        const invoice = Joi.object({
            invoiceAtt: Joi.any().required()
        });
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
                req.body[file.fieldname] = file
        }
        await invoice.validateAsync(req.body);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateInvoiceId: RequestHandler = async (req, res, next) => {
    try {
        const validateInvoiceId = Joi.object({
            invoiceId: Joi.number().required()
        });

        const { invoiceId } = await validateInvoiceId.validateAsync(req.params);
        const invoice = await BOInvoices.findOne({ where: { id: invoiceId } })
        if (invoice)
            next();
        else {
            return res.status(404).json({
                success: false,
                message: "Invoice with this id doesn't exists",
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
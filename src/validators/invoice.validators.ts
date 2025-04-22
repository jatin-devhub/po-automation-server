import { RequestHandler } from "express";
import Joi from "joi";
import SKU from "../models/sku/SKU";
import PurchaseOrder from "../models/PurchaseOrder";

export const validateNewInvoice: RequestHandler = async (req, res, next) => {
    try {
        const newInvoiceSchema = Joi.object({
            poCode: Joi.string().required()
                .external(async (value) => {
                    const tempPO = await PurchaseOrder.findOne({ where: { poCode: value } });
                    if (!tempPO) {
                        throw new Error("PO Code is not valid.");
                    }
                }),
            invoiceDate: Joi.date().required(),
            grnRecords: Joi.array().items(
                Joi.object({
                    skuCode: Joi.string().required()
                        .external(async (value) => {
                            const tempSKU = await SKU.findOne({ where: { skuCode: value } });
                            if (!tempSKU) {
                                throw new Error("SKU Code is not valid.");
                            }
                        }
                    ),
                    receivedQty: Joi.number().required(),
                    damaged: Joi.number().required(),
                    expiryDate: Joi.string()
                })
            )
        });
        // const files = req.files as Express.Multer.File[];
        // for (const file of files) {
        //     req.body[file.fieldname] = file
        // }
        req.body.grnRecords = JSON.parse(req.body.grnRecords);
        await newInvoiceSchema.validateAsync(req.body);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}
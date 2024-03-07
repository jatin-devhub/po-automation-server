import { RequestHandler } from "express";
import Vendor from "../models/Vendor";
import SKU from "../models/SKU";
import { sendMailSetup } from "../utils/mail.service";
import { Sequelize } from "sequelize-typescript";

export const skuRegistration: RequestHandler = async (req, res) => {
    try {
        const { createdBy, skus } = req.body;
        const skuJSON = JSON.parse(skus)
        const vendorCode = req.params.vendorCode;
        const vendor = await Vendor.findOne({ where: { vendorCode } });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const vendorId = vendor.id;
        const skusToCreate = skuJSON.map((sku: any) => ({
            ...sku,
            vendorId,
            createdBy
        }));

        await SKU.bulkCreate(skusToCreate, { validate: true });

        const variables = {
            "companyName": vendor?.companyName
        }

        const mailSent = await sendMailSetup(vendorCode, 'new-skus', variables, undefined);

        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `${skusToCreate.length} SKUs have been successfully added.`,
                data: [],
            });

        return res.status(404).json({
            success: false,
            message: `Unable to send email.`,
            data: {
                mailSent
            }
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const sendVerifyMail: RequestHandler = async (req, res) => {
    try {
        const { vendorCode } = req.body;

        const vendor = await Vendor.findOne({ where: { vendorCode } })

        const variables = {
            "companyName": vendor?.companyName
        }

        const mailSent = await sendMailSetup(vendorCode, 'new-skus', variables, undefined);

        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Mail has been sent successfully`,
                data: [],
            });

        return res.status(404).json({
            success: false,
            message: `Unable to send email.`,
            data: {
                mailSent
            }
        })

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> sendVerifyMail"
            },
        });
    }
};

export const getUnverifiedSKUs: RequestHandler = async (req, res) => {
    try {
        const { vendorCode } = req.params;

        const vendor = await Vendor.findOne({ where: { vendorCode } })

        const skus = await SKU.findAll({ attributes: [[Sequelize.col('skuCode'), 'SKU'], [Sequelize.col('category'), 'Category'], [Sequelize.col('subCategory'), 'SubCategory'], [Sequelize.col('brand'), 'Brand'], [Sequelize.col('productTitle'), 'Product Title'], [Sequelize.col('hsn'), 'HSN'], [Sequelize.col('ean'), 'EAN'], [Sequelize.col('modelNumber'), 'Model Number'], [Sequelize.col('size'), 'Size'], [Sequelize.col('colorFamilyColor'), 'Color Family-Color'], [Sequelize.col('productLengthCm'), 'Prdct L(cm)'], [Sequelize.col('productBreadthCm'), 'Prdct B(cm)'], [Sequelize.col('productHeightCm'), 'Prdct H(cm)'], [Sequelize.col('productWeightKg'), 'Wght(kg)'], [Sequelize.col('masterCartonQty'), 'MSTRCTN Box Qty'], [Sequelize.col('masterCartonLengthCm'), 'MSTRCTN L(cm)'], [Sequelize.col('masterCartonBreadthCm'), 'MSTRCTN B(cm)'], [Sequelize.col('masterCartonHeightCm'), 'MSTRCTN H(cm)'], [Sequelize.col('masterCartonWeightKg'), 'Wght(kg)'], [Sequelize.col('mrp'), 'MRP']], where: { isVerified: false, vendorId: vendor?.id } })

        return res.status(201).json({
            success: true,
            message: `Your unverified skus are`,
            data: {
                skus
            },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> sendVerifyMail"
            },
        });
    }

}

export const applyReview: RequestHandler = async (req, res) => {
    try {
        const { vendorCode, isValid, reason } = req.body;

        const vendor = await Vendor.findOne({ where: { vendorCode } })
        const sku = await SKU.findOne({ where: { isVerified: false, vendorId: vendor?.id } })

        if (isValid == "true") {
            const variables = {
                company: vendor?.companyName
            }
            await sendMailSetup(null, 'skus-success', variables, sku?.createdBy)
            await SKU.update(
                { isVerified: true },
                { where: { vendorId: vendor?.id } }
            );

        }
        else {
            const variables = {
                denyReason: reason
            }
            await sendMailSetup(null, 'skus-fail', variables, sku?.createdBy)
            await SKU.destroy({ where: { isVerified: false, vendorId: vendor?.id } })
        }


        return res.status(201).json({
            success: true,
            message: `Your review is done`,
            data: {},
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> applyReview"
            },
        });
    }

}
import { RequestHandler } from "express";
import Joi from "joi";
import Vendor from "../models/Vendor";

export const validateNew: RequestHandler = async (req, res, next) => {
    try {
        const schema = Joi.object({
            createdBy: Joi.string().email().required(),
            skus: Joi.string().required()
        });
        const skusSchema = Joi.array().items(Joi.object({
            skuCode: Joi.string().required(),
            category: Joi.string(),
            subCategory: Joi.string(),
            brand: Joi.string(),
            productTitle: Joi.string(),
            hsn: Joi.number(),
            ean: Joi.number(),
            modelNumber: Joi.string(),
            size: Joi.string(),
            colorFamilyColor: Joi.string(),
            productLengthCm: Joi.number().min(0),
            productBreadthCm: Joi.number().min(0),
            productHeightCm: Joi.number().min(0),
            productWeightKg: Joi.number().min(0),
            masterCartonQty: Joi.number().integer().min(0),
            masterCartonLengthCm: Joi.number().min(0),
            masterCartonBreadthCm: Joi.number().min(0),
            masterCartonHeightCm: Joi.number().min(0),
            masterCartonWeightKg: Joi.number().min(0),
            MRP: Joi.number().min(0),
        })).min(1).required()

        const { skus } = await schema.validateAsync(req.body);
        const skuJSON = JSON.parse(skus);
        await skusSchema.validateAsync(skuJSON)
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const validateVendorCode: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            vendorCode: Joi.string().required()
        });

        const value = await validateVendorCode.validateAsync(req.params);
        const vendorCode = value.vendorCode;
        const vendor = await Vendor.findOne({ where: { vendorCode } })
        if (vendor)
            next();
        else {
            return res.status(404).json({
                success: false,
                message: "Vendor with this vendor code doesn't exists",
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

export const validateReview: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            vendorCode: Joi.string().required(),
            isValid: Joi.boolean().required(),
            reason: Joi.string()
        });

        const value = await validateVendorCode.validateAsync(req.body);
        const vendorCode = value.vendorCode;
        const vendor = await Vendor.findOne({ where: { vendorCode } })
        if (vendor)
            next();
        else {
            return res.status(404).json({
                success: false,
                message: "Vendor with this vendor code doesn't exists",
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
// export const validateSignUp: RequestHandler = async (req, res, next) => {
//     try {
//         const signUpSchema = Joi.object({
//             email: Joi.string()
//                 .email()
//                 .required(),

//             password: Joi.string()
//                 .min(8)
//                 .max(20)
//                 .required()
//         })

//         const value = await signUpSchema.validateAsync(req.body);
//         const { email } = value;
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User with this email already exists!",
//                 data: [],
//             });
//         }
//         next();

//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }
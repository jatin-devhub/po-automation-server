import { RequestHandler } from "express";
import Joi from "joi";

export const validateNew: RequestHandler =async (req, res, next) => {
    try {
        const newSkuSchema = Joi.object({
            skuCode: Joi.string().required(),
            category: Joi.string(),
            brand: Joi.string(),
            productTitle: Joi.string(),
            hsn: Joi.string(),
            ean: Joi.string(),
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
            vendorCode: Joi.string()
        });

        const value = await newSkuSchema.validateAsync(req.body);
        next();

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
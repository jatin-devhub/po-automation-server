import { RequestHandler } from "express";
import Joi from "joi";

// export const validateNew: RequestHandler =async (req, res, next) => {
//     try {
//         const validateNewSchema = Joi.object({
//             companyName: Joi.string().required(),
//             gst: Joi.string().required(),
//             address: Joi.string().required(),
//             beneficiary: Joi.string().required(),
//             accountNumber: Joi.string().required(),
//             ifsc: Joi.string().required(),
//             bankName: Joi.string().required(),
//             branch: Joi.string().required(),
//             coi: Joi.string().required(),
//             msme: Joi.string().required(),
//             tradeMark: Joi.string().required(),
//             agreement: Joi.string().required(),
//             gstAttachment: Joi.any().required(),
//             bankAttachment: Joi.any().required(),
//             coiAttachment: Joi.any().required(),
//             msmeAttachment: Joi.any().required(),
//             tradeAttachment: Joi.any().required(),
//             agreementAttachment: Joi.any().required(),
//         })
// }

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
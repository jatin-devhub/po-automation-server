import { RequestHandler } from "express";
import Joi from "joi";
import Vendor from "../models/vendor/Vendor";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorDocuments from "../models/vendor/VendorAttachments";
import VendorBank from "../models/vendor/VendorBank";

export const validateNewStart: RequestHandler = async (req, res, next) => {
    try {
        const newVendorSchema = Joi.object({
            companyName: Joi.string().required()
                .external(async (value) => {
                    const tempVendor = await Vendor.findOne({ where: { companyName: value } });
                    if (tempVendor) {
                        throw new Error("Company Name is already registered.");
                    }
                }),
            productCategory: Joi.string().required(),
            contactPersonName: Joi.string().required(),
            contactPersonEmail: Joi.string().email().required()
                .external(async (value) => {
                    const tempContact = await ContactPerson.findOne({ where: { email: value } });
                    if (tempContact) {
                        throw new Error("Email is already in use.");
                    }
                }),
            contactPersonPhone: Joi.string().required()
                .external(async (value) => {
                    const tempContact = await ContactPerson.findOne({ where: { phoneNumber: value } });
                    if (tempContact) {
                        throw new Error("Phone Number is already in use.");
                    }
                }),
            gstId: Joi.string().required()
                .external(async (value) => {
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { gstId: value } });
                    if (tempVendorDocument) {
                        throw new Error("GST ID is already in use.");
                    }
                }),
            addressLine1: Joi.string().required(),
            addressLine2: Joi.string().allow('').optional(),
            countryName: Joi.string().required(),
            countryCode: Joi.string().required(),
            stateName: Joi.string().required(),
            stateCode: Joi.string().required(),
            cityName: Joi.string().required(),
            postalCode: Joi.string().required(),
            beneficiary: Joi.string().required(),
            accountNumber: Joi.string().required()
                .external(async (value) => {
                    const tempVendorBank = await VendorBank.findOne({ where: { accountNumber: value } });
                    if (tempVendorBank) {
                        throw new Error("Account Number is already in use.");
                    }
                }),
            ifsc: Joi.string().required(),
            bankName: Joi.string().required(),
            branch: Joi.string().required(),
            coiId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { coiId: value } });
                    if (tempVendorDocument) {
                        throw new Error("COI ID is already in use.");
                    }
                }),
            msmeId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { msmeId: value } });
                    if (tempVendorDocument) {
                        throw new Error("MSME ID is already in use.");
                    }
                }),
            tradeMarkId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { tradeMarkId: value } });
                    if (tempVendorDocument) {
                        throw new Error("Trade Mark ID is already in use.");
                    }
                }),
            createdBy: Joi.string().email(),
            otherFields: Joi.string()
        });

        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "Request body is empty",
                data: []
            })
        await newVendorSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details?.map((err: any) => err.message) || [error.message],
        });
    }
};

export const validateNewComplete: RequestHandler = async (req, res, next) => {
    try {
        const vendorCompleteSchema = Joi.object({
            vendorId: Joi.number().required()
        });

        await vendorCompleteSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details?.map((err: any) => err.message) || [error.message],
        });
    }
};

export const validateUpdate: RequestHandler = async (req, res, next) => {
    try {
        const updateVendorSchema = Joi.object({
            companyName: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendor = await Vendor.findOne({ where: { companyName: value } });
                    if (tempVendor) {
                        throw new Error("Company Name is already registered.");
                    }
                }),
            productCategory: Joi.string(),
            contactPersonName: Joi.string(),
            contactPersonEmail: Joi.string().email()
                .external(async (value) => {
                    if (!value) return;
                    const tempContact = await ContactPerson.findOne({ where: { email: value } });
                    if (tempContact) {
                        throw new Error("Email is already in use.");
                    }
                }),
            contactPersonPhone: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempContact = await ContactPerson.findOne({ where: { phoneNumber: value } });
                    if (tempContact) {
                        throw new Error("Phone Number is already in use.");
                    }
                }),
            gstId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { gstId: value } });
                    if (tempVendorDocument) {
                        throw new Error("GST ID is already in use.");
                    }
                }),
            addressLine1: Joi.string(),
            addressLine2: Joi.string().allow('').optional(),
            countryName: Joi.string(),
            countryCode: Joi.string(),
            stateName: Joi.string(),
            stateCode: Joi.string(),
            cityName: Joi.string(),
            postalCode: Joi.string(),
            beneficiary: Joi.string(),
            accountNumber: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorBank = await VendorBank.findOne({ where: { accountNumber: value } });
                    if (tempVendorBank) {
                        throw new Error("Account Number is already in use.");
                    }
                }),
            ifsc: Joi.string(),
            bankName: Joi.string(),
            branch: Joi.string(),
            coiId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { coiId: value } });
                    if (tempVendorDocument) {
                        throw new Error("COI ID is already in use.");
                    }
                }),
            msmeId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { msmeId: value } });
                    if (tempVendorDocument) {
                        throw new Error("MSME ID is already in use.");
                    }
                }),
            tradeMarkId: Joi.string()
                .external(async (value) => {
                    if (!value) return;
                    const tempVendorDocument = await VendorDocuments.findOne({ where: { tradeMarkId: value } });
                    if (tempVendorDocument) {
                        throw new Error("Trade Mark ID is already in use.");
                    }
                }),
            otherFields: Joi.string()
        });
        await updateVendorSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateVendorCode: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            vendorCode: Joi.string().required(),
        })

        const value = await validateVendorCode.validateAsync(req.params);
        const { vendorCode } = value;

        const vendor = await Vendor.findOne({ where: { vendorCode } })
        if (vendor)
            next();
        else
            return res.status(404).json({
                success: false,
                message: 'Vendor with this vendor code not exists',
                data: []
            })

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateValidation: RequestHandler = async (req, res, next) => {
    try {
        const validateValidationSchema = Joi.object({
            isValid: Joi.boolean().required(),
            reason: Joi.string()
        });

        const { error } = validateValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                data: []
            })
        }
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
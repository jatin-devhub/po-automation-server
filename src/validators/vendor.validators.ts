import { RequestHandler } from "express";
import Joi from "joi";
import Vendor from "../models/vendor/Vendor";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorDocuments from "../models/vendor/VendorDocuments";
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
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
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
            otherFields: Joi.array().items(
                Joi.object({
                    key: Joi.string().required(),
                    value: Joi.string()
                })
            )
        });

        if(!req.body)
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

export const validateNew: RequestHandler = async (req, res, next) => {
    try {
        const newVendorSchema = Joi.object({
            companyName: Joi.string().required(),
            productCategory: Joi.string().required(),
            contactPersonName: Joi.string().required(),
            contactPersonEmail: Joi.string().required(),
            contactPersonPhone: Joi.string().required(),
            gst: Joi.string().required(),
            addressLine1: Joi.string().required(),
            addressLine2: Joi.string().allow('').optional(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            beneficiary: Joi.string().required(),
            accountNumber: Joi.string().required(),
            ifsc: Joi.string().required(),
            bankName: Joi.string().required(),
            branch: Joi.string().required(),
            coi: Joi.string(),
            msme: Joi.string(),
            tradeMark: Joi.string(),
            createdBy: Joi.string().email(),
            otherFields: Joi.any(),
            gstAttachment: Joi.any().required(),
            bankAttachment: Joi.any().required(),
            coiAttachment: Joi.any(),
            msmeAttachment: Joi.any(),
            tradeAttachment: Joi.any(),
            agreementAttachment: Joi.any().required(),
        })
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
            if (!file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file
        }
        const { contactPersonEmail, contactPersonPhone, companyName } = await newVendorSchema.validateAsync(req.body);
        const tempContact = await ContactPerson.findOne({ where: { email: contactPersonEmail, phoneNumber: contactPersonPhone } })
        const tempVendor = await Vendor.findOne({ where: { companyName } })
        if (tempVendor)
            return res.status(404).json({
                success: false,
                message: "Company Name is already registered with us. If you feel there's an issue please contact our team."
            })
        if (tempContact)
            return res.status(404).json({
                success: false,
                message: 'Contact Email or Phone Number already exist.'
            })
        for (const file of files) {
            if (file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file
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

export const validateUpdatedVendorDetails: RequestHandler = async (req, res, next) => {
    try {
        const updateVendorSchema = Joi.object({
            companyName: Joi.string().required(),
            productCategory: Joi.string().required(),
            contactPersonName: Joi.string().required(),
            contactPersonEmail: Joi.string().required(),
            contactPersonPhone: Joi.string().required(),
            gst: Joi.string().required(),
            addressLine1: Joi.string().required(),
            addressLine2: Joi.string().allow('').optional(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            beneficiary: Joi.string().required(),
            accountNumber: Joi.string().required(),
            ifsc: Joi.string().required(),
            bankName: Joi.string().required(),
            branch: Joi.string().required(),
            coi: Joi.string(),
            msme: Joi.string(),
            tradeMark: Joi.string(),
            createdBy: Joi.string().email()
        })
        const { vendorCode } = req.params;
        const vendor = await Vendor.findOne({ where: { vendorCode } })
        if (vendor) {
            await updateVendorSchema.validateAsync(req.body);
            next();
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No vendor exist with the given vendor code",
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

export const validateUpdate: RequestHandler = async (req, res, next) => {
    try {
        const updateVendorSchema = Joi.object({
            companyName: Joi.string().required(),
            productCategory: Joi.string().required(),
            contactPersonName: Joi.string().required(),
            contactPersonEmail: Joi.string().required(),
            contactPersonPhone: Joi.string().required(),
            gst: Joi.string().required(),
            addressLine1: Joi.string().required(),
            addressLine2: Joi.string().allow('').optional(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            beneficiary: Joi.string().required(),
            accountNumber: Joi.string().required(),
            ifsc: Joi.string().required(),
            bankName: Joi.string().required(),
            branch: Joi.string().required(),
            coi: Joi.string(),
            msme: Joi.string(),
            tradeMark: Joi.string(),
            createdBy: Joi.string().email(),
            otherFields: Joi.any(),
            gstAttachment: Joi.any().required(),
            bankAttachment: Joi.any().required(),
            coiAttachment: Joi.any(),
            msmeAttachment: Joi.any(),
            tradeAttachment: Joi.any(),
            agreementAttachment: Joi.any().required(),
        })
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
            if (!file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file
        }
        const { vendorCode } = req.params;
        const vendor = await Vendor.findOne({ where: { vendorCode } })
        if (vendor) {
            const value = await updateVendorSchema.validateAsync(req.body);
            for (const file of files) {
                if (file.fieldname.startsWith('otherFieldsAttachments-'))
                    req.body[file.fieldname] = file
            }
            next();
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No vendor exist with the given vendor code",
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
            vendorCode: Joi.string().required(),
            isValid: Joi.boolean().required(),
            reason: Joi.string()
        });

        const value = await validateValidationSchema.validateAsync(req.body);
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
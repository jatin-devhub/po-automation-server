"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValidation = exports.validateVendorCode = exports.validateUpdate = exports.validateUpdatedVendorDetails = exports.validateNew = exports.validateNewComplete = exports.validateNewStart = void 0;
const joi_1 = __importDefault(require("joi"));
const Vendor_1 = __importDefault(require("../models/vendor/Vendor"));
const ContactPerson_1 = __importDefault(require("../models/vendor/ContactPerson"));
const VendorAttachments_1 = __importDefault(require("../models/vendor/VendorAttachments"));
const VendorBank_1 = __importDefault(require("../models/vendor/VendorBank"));
const validateNewStart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newVendorSchema = joi_1.default.object({
            companyName: joi_1.default.string().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempVendor = yield Vendor_1.default.findOne({ where: { companyName: value } });
                if (tempVendor) {
                    throw new Error("Company Name is already registered.");
                }
            })),
            productCategory: joi_1.default.string().required(),
            contactPersonName: joi_1.default.string().required(),
            contactPersonEmail: joi_1.default.string().email().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempContact = yield ContactPerson_1.default.findOne({ where: { email: value } });
                if (tempContact) {
                    throw new Error("Email is already in use.");
                }
            })),
            contactPersonPhone: joi_1.default.string().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempContact = yield ContactPerson_1.default.findOne({ where: { phoneNumber: value } });
                if (tempContact) {
                    throw new Error("Phone Number is already in use.");
                }
            })),
            gstId: joi_1.default.string().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempVendorDocument = yield VendorAttachments_1.default.findOne({ where: { gstId: value } });
                if (tempVendorDocument) {
                    throw new Error("GST ID is already in use.");
                }
            })),
            addressLine1: joi_1.default.string().required(),
            addressLine2: joi_1.default.string().allow('').optional(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            postalCode: joi_1.default.string().required(),
            beneficiary: joi_1.default.string().required(),
            accountNumber: joi_1.default.string().required()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                const tempVendorBank = yield VendorBank_1.default.findOne({ where: { accountNumber: value } });
                if (tempVendorBank) {
                    throw new Error("Account Number is already in use.");
                }
            })),
            ifsc: joi_1.default.string().required(),
            bankName: joi_1.default.string().required(),
            branch: joi_1.default.string().required(),
            coiId: joi_1.default.string()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                if (!value)
                    return;
                const tempVendorDocument = yield VendorAttachments_1.default.findOne({ where: { coiId: value } });
                if (tempVendorDocument) {
                    throw new Error("COI ID is already in use.");
                }
            })),
            msmeId: joi_1.default.string()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                if (!value)
                    return;
                const tempVendorDocument = yield VendorAttachments_1.default.findOne({ where: { msmeId: value } });
                if (tempVendorDocument) {
                    throw new Error("MSME ID is already in use.");
                }
            })),
            tradeMarkId: joi_1.default.string()
                .external((value) => __awaiter(void 0, void 0, void 0, function* () {
                if (!value)
                    return;
                const tempVendorDocument = yield VendorAttachments_1.default.findOne({ where: { tradeMarkId: value } });
                if (tempVendorDocument) {
                    throw new Error("Trade Mark ID is already in use.");
                }
            })),
            createdBy: joi_1.default.string().email(),
            otherFields: joi_1.default.array().items(joi_1.default.object({
                key: joi_1.default.string().required(),
                value: joi_1.default.string()
            }))
        });
        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "Request body is empty",
                data: []
            });
        yield newVendorSchema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: ((_a = error.details) === null || _a === void 0 ? void 0 : _a.map((err) => err.message)) || [error.message],
        });
    }
});
exports.validateNewStart = validateNewStart;
const validateNewComplete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const vendorCompleteSchema = joi_1.default.object({
            vendorId: joi_1.default.number().required()
        });
        yield vendorCompleteSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: ((_b = error.details) === null || _b === void 0 ? void 0 : _b.map((err) => err.message)) || [error.message],
        });
    }
});
exports.validateNewComplete = validateNewComplete;
const validateNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVendorSchema = joi_1.default.object({
            companyName: joi_1.default.string().required(),
            productCategory: joi_1.default.string().required(),
            contactPersonName: joi_1.default.string().required(),
            contactPersonEmail: joi_1.default.string().required(),
            contactPersonPhone: joi_1.default.string().required(),
            gst: joi_1.default.string().required(),
            addressLine1: joi_1.default.string().required(),
            addressLine2: joi_1.default.string().allow('').optional(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            postalCode: joi_1.default.string().required(),
            beneficiary: joi_1.default.string().required(),
            accountNumber: joi_1.default.string().required(),
            ifsc: joi_1.default.string().required(),
            bankName: joi_1.default.string().required(),
            branch: joi_1.default.string().required(),
            coi: joi_1.default.string(),
            msme: joi_1.default.string(),
            tradeMark: joi_1.default.string(),
            createdBy: joi_1.default.string().email(),
            otherFields: joi_1.default.any(),
            gstAttachment: joi_1.default.any().required(),
            bankAttachment: joi_1.default.any().required(),
            coiAttachment: joi_1.default.any(),
            msmeAttachment: joi_1.default.any(),
            tradeAttachment: joi_1.default.any(),
            agreementAttachment: joi_1.default.any().required(),
        });
        const files = req.files;
        for (const file of files) {
            if (!file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file;
        }
        const { contactPersonEmail, contactPersonPhone, companyName } = yield newVendorSchema.validateAsync(req.body);
        const tempContact = yield ContactPerson_1.default.findOne({ where: { email: contactPersonEmail, phoneNumber: contactPersonPhone } });
        const tempVendor = yield Vendor_1.default.findOne({ where: { companyName } });
        if (tempVendor)
            return res.status(404).json({
                success: false,
                message: "Company Name is already registered with us. If you feel there's an issue please contact our team."
            });
        if (tempContact)
            return res.status(404).json({
                success: false,
                message: 'Contact Email or Phone Number already exist.'
            });
        for (const file of files) {
            if (file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file;
        }
        next();
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateNew = validateNew;
const validateUpdatedVendorDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateVendorSchema = joi_1.default.object({
            companyName: joi_1.default.string().required(),
            productCategory: joi_1.default.string().required(),
            contactPersonName: joi_1.default.string().required(),
            contactPersonEmail: joi_1.default.string().required(),
            contactPersonPhone: joi_1.default.string().required(),
            gst: joi_1.default.string().required(),
            addressLine1: joi_1.default.string().required(),
            addressLine2: joi_1.default.string().allow('').optional(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            postalCode: joi_1.default.string().required(),
            beneficiary: joi_1.default.string().required(),
            accountNumber: joi_1.default.string().required(),
            ifsc: joi_1.default.string().required(),
            bankName: joi_1.default.string().required(),
            branch: joi_1.default.string().required(),
            coi: joi_1.default.string(),
            msme: joi_1.default.string(),
            tradeMark: joi_1.default.string(),
            createdBy: joi_1.default.string().email()
        });
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (vendor) {
            yield updateVendorSchema.validateAsync(req.body);
            next();
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No vendor exist with the given vendor code",
                data: {}
            });
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateUpdatedVendorDetails = validateUpdatedVendorDetails;
const validateUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateVendorSchema = joi_1.default.object({
            companyName: joi_1.default.string().required(),
            productCategory: joi_1.default.string().required(),
            contactPersonName: joi_1.default.string().required(),
            contactPersonEmail: joi_1.default.string().required(),
            contactPersonPhone: joi_1.default.string().required(),
            gst: joi_1.default.string().required(),
            addressLine1: joi_1.default.string().required(),
            addressLine2: joi_1.default.string().allow('').optional(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            postalCode: joi_1.default.string().required(),
            beneficiary: joi_1.default.string().required(),
            accountNumber: joi_1.default.string().required(),
            ifsc: joi_1.default.string().required(),
            bankName: joi_1.default.string().required(),
            branch: joi_1.default.string().required(),
            coi: joi_1.default.string(),
            msme: joi_1.default.string(),
            tradeMark: joi_1.default.string(),
            createdBy: joi_1.default.string().email(),
            otherFields: joi_1.default.any(),
            gstAttachment: joi_1.default.any().required(),
            bankAttachment: joi_1.default.any().required(),
            coiAttachment: joi_1.default.any(),
            msmeAttachment: joi_1.default.any(),
            tradeAttachment: joi_1.default.any(),
            agreementAttachment: joi_1.default.any().required(),
        });
        const files = req.files;
        for (const file of files) {
            if (!file.fieldname.startsWith('otherFieldsAttachments-'))
                req.body[file.fieldname] = file;
        }
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (vendor) {
            const value = yield updateVendorSchema.validateAsync(req.body);
            for (const file of files) {
                if (file.fieldname.startsWith('otherFieldsAttachments-'))
                    req.body[file.fieldname] = file;
            }
            next();
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No vendor exist with the given vendor code",
                data: {}
            });
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateUpdate = validateUpdate;
const validateVendorCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateVendorCode = joi_1.default.object({
            vendorCode: joi_1.default.string().required(),
        });
        const value = yield validateVendorCode.validateAsync(req.params);
        const { vendorCode } = value;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (vendor)
            next();
        else
            return res.status(404).json({
                success: false,
                message: 'Vendor with this vendor code not exists',
                data: []
            });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateVendorCode = validateVendorCode;
const validateValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateValidationSchema = joi_1.default.object({
            vendorCode: joi_1.default.string().required(),
            isValid: joi_1.default.boolean().required(),
            reason: joi_1.default.string()
        });
        const value = yield validateValidationSchema.validateAsync(req.body);
        const { vendorCode } = value;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (vendor)
            next();
        else
            return res.status(404).json({
                success: false,
                message: 'Vendor with this vendor code not exists',
                data: []
            });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateValidation = validateValidation;
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

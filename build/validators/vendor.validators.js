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
exports.validateVendorCode = exports.validateToken = exports.validateNew = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Vendor_1 = __importDefault(require("../models/Vendor"));
let JWTKEY = process.env.JWTKEY || 'MYNAME-IS-HELLOWORLD-AND-I-AM-FROM-PLUTO-))!!@@-NAME-IS-PLUTO';
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
        const value = yield newVendorSchema.validateAsync(req.body);
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
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenSchema = joi_1.default.object({
            validateToken: joi_1.default.string().required(),
        });
        const value = yield tokenSchema.validateAsync(req.params);
        const { validateToken } = value;
        jsonwebtoken_1.default.verify(validateToken, JWTKEY, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message,
                    data: [],
                });
            }
            const vendor = yield Vendor_1.default.findOne({ where: { vendorCode: decodedToken.vendorCode } });
            if (vendor) {
                req.body.vendor = vendor;
                next();
            }
            else
                return res.status(404).json({
                    success: false,
                    message: 'Vendor with this vendor code not exists',
                    data: []
                });
        }));
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
});
exports.validateToken = validateToken;
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

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
exports.validateNew = void 0;
const joi_1 = __importDefault(require("joi"));
const validateNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVendorSchema = joi_1.default.object({
            companyName: joi_1.default.string().required(),
            gst: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
            isInternational: joi_1.default.boolean().required(),
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

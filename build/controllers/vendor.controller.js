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
exports.getVendor = exports.getAllVendors = exports.updateVendor = exports.updateVendorDetails = exports.vendorRegistration = exports.vendorRegistrationComplete = exports.vendorRegistrationStart = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const Vendor_1 = __importDefault(require("../models/vendor/Vendor"));
const File_1 = __importDefault(require("../models/File"));
const VendorBank_1 = __importDefault(require("../models/vendor/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/vendor/VendorOther"));
const ContactPerson_1 = __importDefault(require("../models/vendor/ContactPerson"));
const VendorAddress_1 = __importDefault(require("../models/vendor/VendorAddress"));
const SKU_1 = __importDefault(require("../models/sku/SKU"));
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const mail_service_1 = require("../utils/mail.service");
const Comment_1 = __importDefault(require("../models/Comment"));
const VendorProfile_1 = __importDefault(require("../models/vendor/VendorProfile"));
const VendorAttachments_1 = __importDefault(require("../models/vendor/VendorAttachments"));
const vendorRegistrationStart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield connection_1.default.transaction();
    try {
        const { companyName, productCategory, addressLine1, addressLine2, country, state, city, postalCode, gstId, coiId, msmeId, tradeMarkId, createdBy, contactPersonName, contactPersonEmail, contactPersonPhone, beneficiary, accountNumber, ifsc, bankName, branch, otherFields } = req.body;
        let otherFieldsIds = [];
        const vendorCode = yield getNewVendorCode(country);
        const vendor = yield Vendor_1.default.create({
            vendorCode,
            productCategory,
            companyName
        }, { transaction: t });
        const vendorProfile = yield VendorProfile_1.default.create({
            vendorId: vendor.id,
            createdBy,
        }, { transaction: t });
        const vendorAttachments = yield VendorAttachments_1.default.create({
            vendorProfileId: vendorProfile.id,
            gstId,
            coiId,
            msmeId,
            tradeMarkId
        }, { transaction: t });
        yield ContactPerson_1.default.create({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });
        yield VendorAddress_1.default.create({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });
        const vendorBank = yield VendorBank_1.default.create({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });
        if (otherFields) {
            if ((otherFields === null || otherFields === void 0 ? void 0 : otherFields.length) > 0) {
                for (let i = 0; i < otherFields.length; i++) {
                    let field = otherFields[i];
                    const vendorOther = yield VendorOther_1.default.create({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorProfileId: vendorProfile.id,
                    }, { transaction: t });
                    otherFieldsIds.push({ key: field.key, id: vendorOther.id });
                }
            }
        }
        yield t.commit();
        return res.status(201).json({
            success: true,
            message: "Vendor created successfully. Proceed to upload attachments",
            data: {
                vendorId: vendor.id,
                vendorProfileId: vendorProfile.id,
                vendorCode,
                vendorAttachmentsId: vendorAttachments.id,
                vendorBankId: vendorBank.id,
                otherFields: otherFieldsIds
            },
        });
    }
    catch (error) {
        yield t.rollback();
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {
                source: "vendor.controller.js -> vendorRegistrationStart",
            },
        });
    }
});
exports.vendorRegistrationStart = vendorRegistrationStart;
const vendorRegistrationComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.body.vendorId;
        const vendor = yield Vendor_1.default.findOne({ where: { id: vendorId } });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
            });
        }
        const mailSent = yield (0, mail_service_1.sendMailSetup)(vendor.vendorCode, 'new-vendor', undefined, undefined);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Vendor has been successfully added`,
                data: [],
            });
        return res.status(404).json({
            success: false,
            message: `Unable to send email.`,
            data: {
                mailSent
            }
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> vendorRegistrationComplete"
            },
        });
    }
});
exports.vendorRegistrationComplete = vendorRegistrationComplete;
const vendorRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        const vendorCode = yield getNewVendorCode(country);
        const vendor = yield Vendor_1.default.create({
            vendorCode,
            productCategory,
            companyName,
            gst,
            coi,
            msme,
            tradeMark,
            createdBy
        });
        if (!vendor)
            return res.status(404).json({
                success: false,
                message: `Some error occured while creating vendor. Please contact our team for it.`
            });
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi',
                coiAttVendorId: vendor.id
            });
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme',
                msmeAttVendorId: vendor.id
            });
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade',
                tradeMarkAttVendorId: vendor.id
            });
        }
        const gstFile = yield File_1.default.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst',
            gstAttVendorId: vendor.id
        });
        if (!gstFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            });
        const agreementFile = yield File_1.default.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement',
            agreementAttVendorId: vendor.id
        });
        if (!agreementFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            });
        const newContactPerson = new ContactPerson_1.default({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        });
        const contactPerson = yield newContactPerson.save();
        if (!contactPerson)
            return res.status(404).json({
                success: false,
                message: `Unable to create contact person details`
            });
        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');
        const newAdress = new VendorAddress_1.default({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode,
            vendorId: vendor.id
        });
        const address = yield newAdress.save();
        if (!address)
            return res.status(404).json({
                success: false,
                message: `Unable to create address details`
            });
        const newVendorBank = new VendorBank_1.default({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorId: vendor.id
        });
        const vendorBank = yield newVendorBank.save();
        if (!vendorBank)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            });
        const bankProofFile = yield File_1.default.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof',
            vendorBankId: vendorBank.id
        });
        if (!bankProofFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank proof attachments`
            });
        if (otherFields) {
            let otherFieldsObject = JSON.parse(otherFields);
            if ((otherFieldsObject === null || otherFieldsObject === void 0 ? void 0 : otherFieldsObject.length) > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;
                    const newOtherField = new VendorOther_1.default({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor.id
                    });
                    const otherField = yield newOtherField.save();
                    if (!otherField)
                        return res.status(404).json({
                            success: false,
                            message: `Unable to create other fields`
                        });
                    if (req.body[`otherFieldsAttachments-${field.key}`]) {
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
                        otherFile = yield File_1.default.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            vendorOtherId: otherField.id
                        });
                    }
                }
            }
        }
        const mailSent = yield (0, mail_service_1.sendMailSetup)(vendor.vendorCode, 'new-vendor', undefined, undefined);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Vendor has been successfully added`,
                data: [],
            });
        return res.status(404).json({
            success: false,
            message: `Unable to send email.`,
            data: {
                mailSent
            }
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> vendorRegistration"
            },
        });
    }
});
exports.vendorRegistration = vendorRegistration;
const updateVendorDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield connection_1.default.transaction();
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, coi, msme, tradeMark, beneficiary, accountNumber, ifsc, bankName, branch, createdBy } = req.body;
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
            });
        }
        yield Vendor_1.default.update({ productCategory, companyName, gst, coi, msme, tradeMark, createdBy }, { where: { vendorCode }, transaction: t });
        yield ContactPerson_1.default.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorId: vendor.id },
            transaction: t
        });
        yield VendorAddress_1.default.update({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode
        }, {
            where: { vendorId: vendor.id },
            transaction: t
        });
        yield VendorBank_1.default.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorId: vendor.id },
            transaction: t
        });
        yield t.commit();
        return res.status(200).json({
            success: true,
            message: "Vendor details have been successfully updated.",
            data: {
                vendorId: vendor.id,
                vendorCode,
            },
        });
    }
    catch (error) {
        yield t.rollback();
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {
                source: "vendor.controller.js -> updateVendorDetails",
            },
        });
    }
});
exports.updateVendorDetails = updateVendorDetails;
const updateVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({ where: { vendorCode } });
        yield Vendor_1.default.update({ productCategory, companyName, gst, coi, msme, tradeMark, createdBy }, { where: { vendorCode } });
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            yield File_1.default.update({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile
            }, {
                where: { fileType: 'coi', coiAttVendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
            });
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            yield File_1.default.update({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile
            }, {
                where: { fileType: 'msme', msmeAttVendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
            });
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            yield File_1.default.update({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile
            }, {
                where: { fileType: 'trade', tradeMarkAttVendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
            });
        }
        yield File_1.default.update({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile
        }, {
            where: { fileType: 'gst', gstAttVendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        yield File_1.default.update({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile
        }, {
            where: { fileType: 'agreement', agreementAttVendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        yield ContactPerson_1.default.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');
        yield VendorAddress_1.default.update({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode
        }, {
            where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        yield VendorBank_1.default.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        const vendorBank = yield VendorBank_1.default.findOne({ where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        yield File_1.default.update({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile
        }, {
            where: { fileType: 'bankProof', vendorBankId: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.id }
        });
        if (otherFields) {
            yield VendorOther_1.default.destroy({ where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
            let otherFieldsObject = JSON.parse(otherFields);
            if ((otherFieldsObject === null || otherFieldsObject === void 0 ? void 0 : otherFieldsObject.length) > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;
                    const newOtherField = new VendorOther_1.default({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id
                    });
                    const otherField = yield newOtherField.save();
                    if (req.body[`otherFieldsAttachments-${field.key}`]) {
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
                        otherFile = yield File_1.default.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            vendorOtherId: otherField.id
                        });
                    }
                }
            }
        }
        const mailSent = yield (0, mail_service_1.sendMailSetup)(vendorCode, 'update-vendor', undefined, undefined);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Vendor has been successfully updated`,
                data: [],
            });
        return res.status(404).json({
            success: false,
            message: `Some error occured`
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> vendorUpdate"
            },
        });
    }
});
exports.updateVendor = updateVendor;
const getAllVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield Vendor_1.default.findAll({
            attributes: ['vendorCode', 'companyName', 'productCategory'],
            include: [{
                    model: VendorProfile_1.default,
                    where: { isVerified: true },
                    attributes: []
                }]
        });
        return res.status(201).json({
            success: true,
            message: `Vendors data successfully fetched`,
            data: { vendors },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getAllVendors"
            },
        });
    }
});
exports.getAllVendors = getAllVendors;
const getVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({
            where: { vendorCode },
            include: [
                {
                    model: ContactPerson_1.default
                },
                {
                    model: VendorAddress_1.default
                },
                {
                    model: VendorBank_1.default
                },
                {
                    model: VendorOther_1.default
                },
                {
                    model: SKU_1.default,
                },
                {
                    model: PurchaseOrder_1.default
                },
                {
                    model: Comment_1.default
                }
            ]
        });
        return res.status(201).json({
            success: true,
            message: `Vendor data successfully fetched`,
            data: { vendor },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getAllVendors"
            },
        });
    }
});
exports.getVendor = getVendor;
// export const setValidation: RequestHandler = async (req, res) => {
//     try {
//         const { vendorCode, isValid, reason } = req.body;
//         console.log(vendorCode, isValid, reason)
//         const vendor = await Vendor.findOne({
//             where: { vendorCode },
//             include: [
//                 {
//                     model: ContactPerson
//                 }
//             ]
//         });
//         if (isValid == "true") {
//             const variables = {
//                 company: vendor?.companyName,
//                 vendorCode
//             }
//             await sendMailSetup(null, 'vendor-success', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
//             await Vendor.update(
//                 { isVerified: true },
//                 { where: { vendorCode } }
//             );
//         } else {
//             const variables = {
//                 denyReason: reason
//             }
//             const comment = await Comment.create({
//                 comment: reason,
//                 vendorId: vendor?.id,
//             })
//             await sendMailSetup(vendorCode, 'vendor-fail', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
//         }
//         return res.status(201).json({
//             success: true,
//             message: `Vendor Review Done Successfully`,
//             data: {},
//         });
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: {
//                 "source": "vendor.controller.js -> getAllVendors"
//             },
//         });
//     }
// };
const getNewVendorCode = (country) => __awaiter(void 0, void 0, void 0, function* () {
    let prefix;
    if (country != "India")
        prefix = 'VI-';
    else
        prefix = 'VD-';
    let vendorNum, vendorCode, existingVendor;
    do {
        vendorNum = Math.floor(1000 + Math.random() * 9000);
        vendorCode = prefix + vendorNum;
        existingVendor = yield Vendor_1.default.findOne({
            where: {
                vendorCode,
            },
        });
    } while (existingVendor);
    return vendorCode;
});

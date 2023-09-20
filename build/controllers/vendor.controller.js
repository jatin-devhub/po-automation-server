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
exports.setValidation = exports.getVendor = exports.getAllVendors = exports.updateVendor = exports.vendorRegistration = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Vendor_1 = __importDefault(require("../models/Vendor"));
const File_1 = __importDefault(require("../models/File"));
const VendorBank_1 = __importDefault(require("../models/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/VendorOther"));
const ContactPerson_1 = __importDefault(require("../models/ContactPerson"));
const VendorAddress_1 = __importDefault(require("../models/VendorAddress"));
const SKU_1 = __importDefault(require("../models/SKU"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const mail_service_1 = require("../utils/mail.service");
const Comment_1 = __importDefault(require("../models/Comment"));
const vendorRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        const vendorCode = yield getNewVendorCode(country);
        const newVendor = new Vendor_1.default({
            vendorCode,
            productCategory,
            companyName,
            gst,
            coi,
            msme,
            tradeMark,
            createdBy
        });
        const vendor = yield newVendor.save();
        if (!vendor)
            return res.status(404).json({
                success: false,
                message: `Unable to create vendor details`
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
        console.log(mailSent);
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
            attributes: ['vendorCode', 'companyName', [sequelize_typescript_1.Sequelize.col('address.state'), 'state'], [sequelize_typescript_1.Sequelize.col('address.country'), 'country'], 'productCategory'],
            include: [
                {
                    model: VendorAddress_1.default,
                    attributes: [],
                },
            ],
            where: { isVerified: true }
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
                    attributes: [[sequelize_typescript_1.Sequelize.col('skuCode'), 'SKU'], [sequelize_typescript_1.Sequelize.col('category'), 'Category'], [sequelize_typescript_1.Sequelize.col('brand'), 'Brand'], [sequelize_typescript_1.Sequelize.col('productTitle'), 'Product Title'], [sequelize_typescript_1.Sequelize.col('hsn'), 'HSN'], [sequelize_typescript_1.Sequelize.col('ean'), 'EAN'], [sequelize_typescript_1.Sequelize.col('modelNumber'), 'Model Number'], [sequelize_typescript_1.Sequelize.col('size'), 'Size'], [sequelize_typescript_1.Sequelize.col('colorFamilyColor'), 'Color Family-Color'], [sequelize_typescript_1.Sequelize.col('productLengthCm'), 'Prdct L(cm)'], [sequelize_typescript_1.Sequelize.col('productBreadthCm'), 'Prdct B(cm)'], [sequelize_typescript_1.Sequelize.col('productHeightCm'), 'Prdct H(cm)'], [sequelize_typescript_1.Sequelize.col('productWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('masterCartonQty'), 'MSTRCTN Box Qty'], [sequelize_typescript_1.Sequelize.col('masterCartonLengthCm'), 'MSTRCTN L(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonBreadthCm'), 'MSTRCTN B(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonHeightCm'), 'MSTRCTN H(cm)'], [sequelize_typescript_1.Sequelize.col('masterCartonWeightKg'), 'Wght(kg)'], [sequelize_typescript_1.Sequelize.col('mrp'), 'MRP']]
                },
                {
                    model: BuyingOrder_1.default
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
const setValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorCode, isValid, reason } = req.body;
        console.log(vendorCode, isValid, reason);
        const vendor = yield Vendor_1.default.findOne({
            where: { vendorCode },
            include: [
                {
                    model: ContactPerson_1.default
                }
            ]
        });
        if (isValid == "true") {
            const variables = {
                company: vendor === null || vendor === void 0 ? void 0 : vendor.companyName,
                vendorCode
            };
            yield (0, mail_service_1.sendMailSetup)(null, 'vendor-success', variables, (vendor === null || vendor === void 0 ? void 0 : vendor.createdBy) ? vendor.createdBy : vendor === null || vendor === void 0 ? void 0 : vendor.contactPerson.email);
            yield Vendor_1.default.update({ isVerified: true }, { where: { vendorCode } });
        }
        else {
            const variables = {
                denyReason: reason
            };
            const comment = yield Comment_1.default.create({
                comment: reason,
                vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
            });
            yield (0, mail_service_1.sendMailSetup)(vendorCode, 'vendor-fail', variables, (vendor === null || vendor === void 0 ? void 0 : vendor.createdBy) ? vendor.createdBy : vendor === null || vendor === void 0 ? void 0 : vendor.contactPerson.email);
        }
        return res.status(201).json({
            success: true,
            message: `Vendor Review Done Successfully`,
            data: {},
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
exports.setValidation = setValidation;
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

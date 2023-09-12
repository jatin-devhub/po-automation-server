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
exports.getVendor = exports.getAllVendors = exports.vendorRegistration = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Vendor_1 = __importDefault(require("../models/Vendor"));
const File_1 = __importDefault(require("../models/File"));
const VendorBank_1 = __importDefault(require("../models/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/VendorOther"));
const ContactPerson_1 = __importDefault(require("../models/ContactPerson"));
const VendorAddress_1 = __importDefault(require("../models/VendorAddress"));
const SKU_1 = __importDefault(require("../models/SKU"));
const BuyingOrder_1 = __importDefault(require("../models/BuyingOrder"));
const mail_service_1 = require("../utils/mail.service");
const { VENDOR_VALIDATION_EMAIL, TEST_EMAIL } = process.env;
const JWTKEY = process.env.JWTKEY || "MYNAME-IS-HELLOWORLD";
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
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi',
                vendorId: vendor.id
            });
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme',
                vendorId: vendor.id
            });
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            yield File_1.default.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade',
                vendorId: vendor.id
            });
        }
        yield File_1.default.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst',
            vendorId: vendor.id
        });
        yield File_1.default.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement',
            vendorId: vendor.id
        });
        const newContactPerson = new ContactPerson_1.default({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        });
        yield newContactPerson.save();
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
        yield newAdress.save();
        const newVendorBank = new VendorBank_1.default({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorId: vendor.id
        });
        const vendorBank = yield newVendorBank.save();
        const bankProofFile = yield File_1.default.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof',
            vendorBankId: vendorBank.id
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
        const mailSent = yield sendVendorValidationMail(vendor.vendorCode);
        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Vendor has been successfully added`,
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
                "source": "vendor.controller.js -> vendorRegistration"
            },
        });
    }
});
exports.vendorRegistration = vendorRegistration;
const getAllVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield Vendor_1.default.findAll({
            attributes: ['vendorCode', 'companyName', [sequelize_typescript_1.Sequelize.col('address.state'), 'state'], [sequelize_typescript_1.Sequelize.col('address.country'), 'country'], 'productCategory'],
            include: [
                {
                    model: VendorAddress_1.default,
                    attributes: [],
                },
            ]
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
                    model: SKU_1.default
                },
                {
                    model: BuyingOrder_1.default
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
const sendVendorValidationMail = (vendorCode) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ vendorCode, type: 'newVendor' }, JWTKEY);
    const mailOptions = {
        subject: 'Validate New Vendor Details!!',
        title: 'Vendor Validation',
        message: 'A new vendor is being registered. Please validate the details of the vendor so that further work can be done.',
        actionURL: token,
        closingMessage: ''
    };
    if (TEST_EMAIL)
        return yield (0, mail_service_1.sendMail)(TEST_EMAIL, mailOptions);
    return false;
});

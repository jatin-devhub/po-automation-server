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
exports.getAllVendors = exports.vendorRegistration = void 0;
const Vendor_1 = require("../models/Vendor");
const File_1 = __importDefault(require("../models/File"));
const VendorBank_1 = __importDefault(require("../models/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/VendorOther"));
const ContactPerson_1 = require("../models/ContactPerson");
const VendorAddress_1 = require("../models/VendorAddress");
const sequelize_typescript_1 = require("sequelize-typescript");
const vendorRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields } = req.body;
        const vendorCode = yield getNewVendorCode(country);
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        let coiFile = null, msmeFile = null, tradeFile = null;
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            coiFile = yield File_1.default.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi'
            });
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            msmeFile = yield File_1.default.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme'
            });
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            tradeFile = yield File_1.default.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade'
            });
        }
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');
        const gstFile = yield File_1.default.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst'
        });
        const agreementFile = yield File_1.default.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement'
        });
        const bankProofFile = yield File_1.default.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof'
        });
        const newVendor = new Vendor_1.Vendor({
            vendorCode,
            productCategory,
            companyName,
            gst,
            gstAtt: gstFile.id,
            coi,
            coiAtt: coiFile === null || coiFile === void 0 ? void 0 : coiFile.id,
            msme,
            msmeAtt: msmeFile === null || msmeFile === void 0 ? void 0 : msmeFile.id,
            tradeMark,
            tradeMarkAtt: tradeFile === null || tradeFile === void 0 ? void 0 : tradeFile.id,
            agreementAtt: agreementFile.id
        });
        const vendor = yield newVendor.save();
        const newContactPerson = new ContactPerson_1.ContactPerson({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        });
        const contactPerson = yield newContactPerson.save();
        const newAdress = new VendorAddress_1.VendorAddress({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode,
            vendorId: vendor.id
        });
        const address = yield newAdress.save();
        const newVendorBank = new VendorBank_1.default({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            proofAtt: bankProofFile.id,
            vendorId: vendor.id
        });
        const vendorBank = yield newVendorBank.save();
        if (otherFields) {
            let otherFieldsObject = JSON.parse(otherFields);
            if ((otherFieldsObject === null || otherFieldsObject === void 0 ? void 0 : otherFieldsObject.length) > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;
                    if (req.body[`otherFieldsAttachments-${field.key}`]) {
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
                        otherFile = yield File_1.default.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other'
                        });
                    }
                    const newOtherField = new VendorOther_1.default({
                        otherKey: field.key,
                        otherValue: field.value,
                        otherAtt: otherFile === null || otherFile === void 0 ? void 0 : otherFile.id,
                        vendorId: vendor.id
                    });
                    const otherField = newOtherField.save();
                }
            }
        }
        return res.status(201).json({
            success: true,
            message: `Your Vendor has been successfully added`,
            data: [],
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
        const vendors = yield Vendor_1.Vendor.findAll({
            attributes: ['vendorCode', 'companyName', [sequelize_typescript_1.Sequelize.col('address.state'), 'state'], [sequelize_typescript_1.Sequelize.col('address.country'), 'country'], 'productCategory'],
            include: [
                {
                    model: VendorAddress_1.VendorAddress,
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
        existingVendor = yield Vendor_1.Vendor.findOne({
            where: {
                vendorCode,
            },
        });
    } while (existingVendor);
    return vendorCode;
});

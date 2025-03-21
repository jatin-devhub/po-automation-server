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
exports.setValidation = exports.getVendor = exports.getAllVendors = exports.updateVendor = exports.vendorRegistrationComplete = exports.vendorRegistrationStart = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const Vendor_1 = __importDefault(require("../models/vendor/Vendor"));
const VendorBank_1 = __importDefault(require("../models/vendor/VendorBank"));
const VendorOther_1 = __importDefault(require("../models/vendor/VendorOther"));
const ContactPerson_1 = __importDefault(require("../models/vendor/ContactPerson"));
const VendorAddress_1 = __importDefault(require("../models/vendor/VendorAddress"));
const mail_service_1 = require("../utils/mail.service");
const VendorProfile_1 = __importDefault(require("../models/vendor/VendorProfile"));
const VendorAttachments_1 = __importDefault(require("../models/vendor/VendorAttachments"));
const AttachmentMapping_1 = __importDefault(require("../models/attachment/AttachmentMapping"));
const Attachment_1 = __importDefault(require("../models/attachment/Attachment"));
const Comment_1 = __importDefault(require("../models/Comment"));
const vendorRegistrationStart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield connection_1.default.transaction();
    try {
        const { companyName, productCategory, addressLine1, addressLine2, countryName, countryCode, stateName, stateCode, cityName, postalCode, gstId, coiId, msmeId, tradeMarkId, createdBy, contactPersonName, contactPersonEmail, contactPersonPhone, beneficiary, accountNumber, ifsc, bankName, branch, otherFields } = req.body;
        let otherFieldsIds = [];
        const vendorCode = yield getNewVendorCode(countryName);
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
            countryName,
            countryCode,
            stateName,
            stateCode,
            cityName,
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
            let otherFieldsJSON = JSON.parse(otherFields);
            if ((otherFieldsJSON === null || otherFieldsJSON === void 0 ? void 0 : otherFieldsJSON.length) > 0) {
                for (let i = 0; i < otherFieldsJSON.length; i++) {
                    let field = otherFieldsJSON[i];
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
const updateVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield connection_1.default.transaction();
    try {
        const { companyName, productCategory, addressLine1, addressLine2, countryName, countryCode, stateName, stateCode, cityName, postalCode, gstId, coiId, msmeId, tradeMarkId, contactPersonName, contactPersonEmail, contactPersonPhone, beneficiary, accountNumber, ifsc, bankName, branch, otherFields } = req.body;
        const { vendorCode } = req.params;
        let otherFieldsIds = [];
        yield Vendor_1.default.update({
            productCategory,
            companyName
        }, {
            where: { vendorCode },
            transaction: t
        });
        const vendor = yield Vendor_1.default.findOne({
            where: { vendorCode }
        });
        const vendorProfile = yield VendorProfile_1.default.findOne({
            where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id }
        });
        yield VendorAttachments_1.default.update({
            gstId,
            coiId,
            msmeId,
            tradeMarkId
        }, {
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id },
            transaction: t
        });
        const vendorAttachments = yield VendorAttachments_1.default.findOne({
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id }
        });
        yield ContactPerson_1.default.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id },
            transaction: t
        });
        yield VendorAddress_1.default.update({
            addressLine1,
            addressLine2,
            countryName,
            countryCode,
            stateName,
            stateCode,
            cityName,
            postalCode
        }, {
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id },
            transaction: t
        });
        yield VendorBank_1.default.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id }
        });
        const vendorBank = yield VendorBank_1.default.findOne({
            where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id }
        });
        yield VendorOther_1.default.destroy({ where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id } });
        if (otherFields) {
            let otherFieldsJSON = JSON.parse(otherFields);
            if ((otherFieldsJSON === null || otherFieldsJSON === void 0 ? void 0 : otherFieldsJSON.length) > 0) {
                for (let i = 0; i < otherFieldsJSON.length; i++) {
                    let field = otherFieldsJSON[i];
                    const vendorOther = yield VendorOther_1.default.create({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id,
                    }, { transaction: t });
                    otherFieldsIds.push({ key: field.key, id: vendorOther.id });
                }
            }
        }
        yield t.commit();
        return res.status(201).json({
            success: true,
            message: "Vendor updated successfully. Proceed to upload attachments",
            data: {
                vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id,
                vendorCode,
                vendorAttachmentsId: vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.id,
                vendorBankId: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.id,
                otherFields: otherFieldsIds
            },
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
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { vendorCode } = req.params;
        const vendor = yield Vendor_1.default.findOne({
            where: { vendorCode },
            include: [
                {
                    model: VendorProfile_1.default,
                    include: [
                        { model: ContactPerson_1.default },
                        {
                            model: VendorAttachments_1.default,
                            include: [
                                {
                                    model: AttachmentMapping_1.default,
                                    as: 'gstAttachment',
                                    include: [{ model: Attachment_1.default }]
                                },
                                {
                                    model: AttachmentMapping_1.default,
                                    as: 'coiAttachment',
                                    include: [{ model: Attachment_1.default }]
                                },
                                {
                                    model: AttachmentMapping_1.default,
                                    as: 'msmeAttachment',
                                    include: [{ model: Attachment_1.default }]
                                },
                                {
                                    model: AttachmentMapping_1.default,
                                    as: 'tradeMarkAttachment',
                                    include: [{ model: Attachment_1.default }]
                                },
                                {
                                    model: AttachmentMapping_1.default,
                                    as: 'agreementAttachment',
                                    include: [{ model: Attachment_1.default }]
                                }
                            ]
                        },
                        { model: VendorAddress_1.default },
                        {
                            model: VendorBank_1.default,
                            include: [{ model: AttachmentMapping_1.default, include: [{ model: Attachment_1.default }] }]
                        },
                        {
                            model: VendorOther_1.default,
                            include: [{ model: AttachmentMapping_1.default, include: [{ model: Attachment_1.default }] }]
                        },
                        { model: Comment_1.default }
                    ]
                }
            ]
        });
        const vendorProfile = vendor === null || vendor === void 0 ? void 0 : vendor.profile;
        const contactPerson = vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.contactPerson;
        const vendorAttachments = vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.attachments;
        const vendorAddress = vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.address;
        const vendorBank = vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.vendorBank;
        const vendorOthers = (vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.otherFields) || [];
        return res.status(200).json({
            success: true,
            message: `Vendor data successfully fetched`,
            data: {
                vendor: {
                    companyName: vendor === null || vendor === void 0 ? void 0 : vendor.companyName,
                    productCategory: vendor === null || vendor === void 0 ? void 0 : vendor.productCategory,
                    contactPersonName: contactPerson === null || contactPerson === void 0 ? void 0 : contactPerson.name,
                    contactPersonEmail: contactPerson === null || contactPerson === void 0 ? void 0 : contactPerson.email,
                    contactPersonPhone: contactPerson === null || contactPerson === void 0 ? void 0 : contactPerson.phoneNumber,
                    gstId: vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.gstId,
                    "gst-attachment": (_a = vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.gstAttachment) === null || _a === void 0 ? void 0 : _a.attachment,
                    address: {
                        addressLine1: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.addressLine1,
                        addressLine2: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.addressLine2,
                        country: {
                            name: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.countryName,
                            iso2: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.countryCode
                        },
                        state: {
                            name: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.stateName,
                            state_code: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.stateCode
                        },
                        city: {
                            name: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.cityName
                        },
                        postalCode: vendorAddress === null || vendorAddress === void 0 ? void 0 : vendorAddress.postalCode,
                    },
                    beneficiary: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.beneficiaryName,
                    accountNumber: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.accountNumber,
                    ifsc: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.ifsc,
                    bankName: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.bankName,
                    branch: vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.branch,
                    "bank-proof": (_b = vendorBank === null || vendorBank === void 0 ? void 0 : vendorBank.bankProof) === null || _b === void 0 ? void 0 : _b.attachment,
                    coiId: vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.coiId,
                    "coi-attachment": (_c = vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.coiAttachment) === null || _c === void 0 ? void 0 : _c.attachment,
                    msmeId: vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.msmeId,
                    "msme-attachment": (_d = vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.msmeAttachment) === null || _d === void 0 ? void 0 : _d.attachment,
                    tradeMarkId: vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.tradeMarkId,
                    "trade-mark-attachment": (_e = vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.tradeMarkAttachment) === null || _e === void 0 ? void 0 : _e.attachment,
                    "agreement-attachment": (_f = vendorAttachments === null || vendorAttachments === void 0 ? void 0 : vendorAttachments.agreementAttachment) === null || _f === void 0 ? void 0 : _f.attachment,
                    createdBy: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.createdBy,
                    otherFields: vendorOthers.map((other) => {
                        var _a;
                        return ({
                            key: other.otherKey,
                            value: other.otherValue,
                            attachment: (_a = other === null || other === void 0 ? void 0 : other.otherAttachment) === null || _a === void 0 ? void 0 : _a.attachment
                        });
                    }),
                    comment: (_g = vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.comment) === null || _g === void 0 ? void 0 : _g.comment
                },
            },
        });
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getVendor"
            },
        });
    }
});
exports.getVendor = getVendor;
const setValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isValid, reason } = req.body;
        const vendorCode = req.params.vendorCode;
        const vendor = yield Vendor_1.default.findOne({
            where: { vendorCode }
        });
        const vendorProfile = yield VendorProfile_1.default.findOne({
            where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id },
            include: [{
                    model: ContactPerson_1.default
                }]
        });
        if (isValid == "true") {
            // const variables = {
            //     company: vendor?.companyName,
            //     vendorCode
            // }
            // await sendMailSetup(null, 'vendor-success', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
            yield VendorProfile_1.default.update({ isVerified: true }, { where: { vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id } });
        }
        else {
            const variables = {
                denyReason: reason
            };
            const existingComment = yield Comment_1.default.findOne({
                where: { vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id }
            });
            if (existingComment) {
                yield existingComment.update({ comment: reason });
            }
            else {
                yield Comment_1.default.create({
                    comment: reason,
                    vendorProfileId: vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.id,
                });
            }
            yield (0, mail_service_1.sendMailSetup)(vendorCode, 'vendor-fail', variables, (vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.createdBy) ? vendorProfile.createdBy : vendorProfile === null || vendorProfile === void 0 ? void 0 : vendorProfile.contactPerson.email);
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

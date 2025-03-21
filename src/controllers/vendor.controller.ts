import { RequestHandler } from "express";
import { Sequelize } from "sequelize-typescript";
import connection from "../db/connection";

import Vendor from "../models/vendor/Vendor";
import File from "../models/File";
import VendorBank from "../models/vendor/VendorBank";
import VendorOther from "../models/vendor/VendorOther";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorAddress from "../models/vendor/VendorAddress";
import { sendMailSetup } from "../utils/mail.service";
import VendorProfile from "../models/vendor/VendorProfile";
import VendorAttachments from "../models/vendor/VendorAttachments";
import AttachmentMapping from "../models/attachment/AttachmentMapping";
import Attachment from "../models/attachment/Attachment";
import Comment from "../models/Comment";

export const vendorRegistrationStart: RequestHandler = async (req, res) => {
    const t = await connection.transaction();

    try {
        const {
            companyName,
            productCategory,
            addressLine1,
            addressLine2,
            countryName,
            countryCode,
            stateName,
            stateCode,
            cityName,
            postalCode,
            gstId,
            coiId,
            msmeId,
            tradeMarkId,
            createdBy,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhone,
            beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            otherFields
        } = req.body;
        let otherFieldsIds: { key: string, id: number }[] = []

        const vendorCode = await getNewVendorCode(countryName);

        const vendor = await Vendor.create({
            vendorCode,
            productCategory,
            companyName
        }, { transaction: t });

        const vendorProfile = await VendorProfile.create({
            vendorId: vendor.id,
            createdBy,
        }, { transaction: t });

        const vendorAttachments = await VendorAttachments.create({
            vendorProfileId: vendorProfile.id,
            gstId,
            coiId,
            msmeId,
            tradeMarkId
        }, { transaction: t });

        await ContactPerson.create({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });

        await VendorAddress.create({
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

        const vendorBank = await VendorBank.create({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });

        if (otherFields) {
            let otherFieldsJSON = JSON.parse(otherFields);
            if (otherFieldsJSON?.length > 0) {
                for (let i = 0; i < otherFieldsJSON.length; i++) {
                    let field = otherFieldsJSON[i];

                    const vendorOther = await VendorOther.create({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorProfileId: vendorProfile.id,
                    }, { transaction: t });

                    otherFieldsIds.push({ key: field.key, id: vendorOther.id });
                }
            }
        }

        await t.commit();

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

    } catch (error: any) {
        await t.rollback();

        return res.status(500).json({
            success: false,
            message: error.message,
            data: {
                source: "vendor.controller.js -> vendorRegistrationStart",
            },
        });
    }
};

export const vendorRegistrationComplete: RequestHandler = async (req, res) => {
    try {
        const vendorId = req.body.vendorId;

        const vendor = await Vendor.findOne({ where: { id: vendorId } });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
            });
        }

        const mailSent = await sendMailSetup(vendor.vendorCode, 'new-vendor', undefined, undefined);

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
        })
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> vendorRegistrationComplete"
            },
        });
    }
};

export const updateVendor: RequestHandler = async (req, res) => {
    const t = await connection.transaction();
    try {
        const {
            companyName,
            productCategory,
            addressLine1,
            addressLine2,
            countryName,
            countryCode,
            stateName,
            stateCode,
            cityName,
            postalCode,
            gstId,
            coiId,
            msmeId,
            tradeMarkId,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhone,
            beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            otherFields
        } = req.body;
        const { vendorCode } = req.params;
        let otherFieldsIds: { key: string, id: number }[] = []

        await Vendor.update({
            productCategory,
            companyName
        }, {
            where: { vendorCode },
            transaction: t
        });

        const vendor = await Vendor.findOne({
            where: { vendorCode }
        });

        const vendorProfile = await VendorProfile.findOne({
            where: { vendorId: vendor?.id }
        });

        await VendorAttachments.update({
            gstId,
            coiId,
            msmeId,
            tradeMarkId
        }, {
            where: { vendorProfileId: vendorProfile?.id },
            transaction: t
        });

        const vendorAttachments = await VendorAttachments.findOne({
            where: { vendorProfileId: vendorProfile?.id }
        });

        await ContactPerson.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorProfileId: vendorProfile?.id },
            transaction: t
        });

        await VendorAddress.update({
            addressLine1,
            addressLine2,
            countryName,
            countryCode,
            stateName,
            stateCode,
            cityName,
            postalCode
        }, {
            where: { vendorProfileId: vendorProfile?.id },
            transaction: t
        });

        await VendorBank.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorProfileId: vendorProfile?.id }
        });

        const vendorBank = await VendorBank.findOne({
            where: { vendorProfileId: vendorProfile?.id }
        });

        await VendorOther.destroy({ where: { vendorProfileId: vendorProfile?.id } })
        if (otherFields) {
            let otherFieldsJSON = JSON.parse(otherFields);
            if (otherFieldsJSON?.length > 0) {
                for (let i = 0; i < otherFieldsJSON.length; i++) {
                    let field = otherFieldsJSON[i];

                    const vendorOther = await VendorOther.create({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorProfileId: vendorProfile?.id,
                    }, { transaction: t });

                    otherFieldsIds.push({ key: field.key, id: vendorOther.id });
                }
            }
        }

        await t.commit();

        return res.status(201).json({
            success: true,
            message: "Vendor updated successfully. Proceed to upload attachments",
            data: {
                vendorId: vendor?.id,
                vendorProfileId: vendorProfile?.id,
                vendorCode,
                vendorAttachmentsId: vendorAttachments?.id,
                vendorBankId: vendorBank?.id,
                otherFields: otherFieldsIds
            },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> vendorUpdate"
            },
        });
    }
};

export const getAllVendors: RequestHandler = async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            attributes: ['vendorCode', 'companyName', 'productCategory'],
            include: [{
                model: VendorProfile,
                where: { isVerified: true },
                attributes: []
            }]
        });

        return res.status(201).json({
            success: true,
            message: `Vendors data successfully fetched`,
            data: { vendors },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getAllVendors"
            },
        });
    }
};

export const getVendor: RequestHandler = async (req, res) => {
    try {
        const { vendorCode } = req.params;

        const vendor = await Vendor.findOne({
            where: { vendorCode },
            include: [
                {
                    model: VendorProfile,
                    include: [
                        { model: ContactPerson },
                        {
                            model: VendorAttachments,
                            include: [
                                {
                                    model: AttachmentMapping,
                                    as: 'gstAttachment',
                                    include: [{ model: Attachment }]
                                },
                                {
                                    model: AttachmentMapping,
                                    as: 'coiAttachment',
                                    include: [{ model: Attachment }]
                                },
                                {
                                    model: AttachmentMapping,
                                    as: 'msmeAttachment',
                                    include: [{ model: Attachment }]
                                },
                                {
                                    model: AttachmentMapping,
                                    as: 'tradeMarkAttachment',
                                    include: [{ model: Attachment }]
                                },
                                {
                                    model: AttachmentMapping,
                                    as: 'agreementAttachment',
                                    include: [{ model: Attachment }]
                                }
                            ]
                        },
                        { model: VendorAddress },
                        {
                            model: VendorBank,
                            include: [{ model: AttachmentMapping, include: [{ model: Attachment }] }]
                        },
                        {
                            model: VendorOther,
                            include: [{ model: AttachmentMapping, include: [{ model: Attachment }] }]
                        },
                        { model: Comment }
                    ]
                }
            ]
        });

        const vendorProfile = vendor?.profile;
        const contactPerson = vendorProfile?.contactPerson;
        const vendorAttachments = vendorProfile?.attachments;
        const vendorAddress = vendorProfile?.address;
        const vendorBank = vendorProfile?.vendorBank;
        const vendorOthers = vendorProfile?.otherFields || [];

        return res.status(200).json({
            success: true,
            message: `Vendor data successfully fetched`,
            data: {
                vendor: {
                    companyName: vendor?.companyName,
                    productCategory: vendor?.productCategory,
                    contactPersonName: contactPerson?.name,
                    contactPersonEmail: contactPerson?.email,
                    contactPersonPhone: contactPerson?.phoneNumber,
                    gstId: vendorAttachments?.gstId,
                    "gst-attachment": vendorAttachments?.gstAttachment?.attachment,
                    address: {
                        addressLine1: vendorAddress?.addressLine1,
                        addressLine2: vendorAddress?.addressLine2,
                        country: {
                            name: vendorAddress?.countryName,
                            iso2: vendorAddress?.countryCode
                        },
                        state: {
                            name: vendorAddress?.stateName,
                            state_code: vendorAddress?.stateCode
                        },
                        city: {
                            name: vendorAddress?.cityName
                        },
                        postalCode: vendorAddress?.postalCode,
                    },
                    beneficiary: vendorBank?.beneficiaryName,
                    accountNumber: vendorBank?.accountNumber,
                    ifsc: vendorBank?.ifsc,
                    bankName: vendorBank?.bankName,
                    branch: vendorBank?.branch,
                    "bank-proof": vendorBank?.bankProof?.attachment,
                    coiId: vendorAttachments?.coiId,
                    "coi-attachment": vendorAttachments?.coiAttachment?.attachment,
                    msmeId: vendorAttachments?.msmeId,
                    "msme-attachment": vendorAttachments?.msmeAttachment?.attachment,
                    tradeMarkId: vendorAttachments?.tradeMarkId,
                    "trade-mark-attachment": vendorAttachments?.tradeMarkAttachment?.attachment,
                    "agreement-attachment": vendorAttachments?.agreementAttachment?.attachment,
                    createdBy: vendorProfile?.createdBy,
                    otherFields: vendorOthers.map((other: VendorOther) => ({
                        key: other.otherKey,
                        value: other.otherValue,
                        attachment: other?.otherAttachment?.attachment
                    })),
                    comment: vendorProfile?.comment?.comment
                },
            },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getVendor"
            },
        });
    }
};

export const setValidation: RequestHandler = async (req, res) => {
    try {
        const { isValid, reason } = req.body;
        const vendorCode = req.params.vendorCode;

        const vendor = await Vendor.findOne({
            where: { vendorCode }
        });

        const vendorProfile = await VendorProfile.findOne({
            where: { vendorId: vendor?.id },
            include: [{
                model: ContactPerson
            }]
        });
        if (isValid == "true") {
            // const variables = {
            //     company: vendor?.companyName,
            //     vendorCode
            // }
            // await sendMailSetup(null, 'vendor-success', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
            await VendorProfile.update(
                { isVerified: true },
                { where: { vendorId: vendor?.id } }
            );
        } else {
            const variables = {
                denyReason: reason
            }
            const existingComment = await Comment.findOne({
                where: { vendorProfileId: vendorProfile?.id }
            });

            if (existingComment) {
                await existingComment.update({ comment: reason });
            } else {
                await Comment.create({
                    comment: reason,
                    vendorProfileId: vendorProfile?.id,
                });
            }
            await sendMailSetup(vendorCode, 'vendor-fail', variables, vendorProfile?.createdBy ? vendorProfile.createdBy : vendorProfile?.contactPerson.email)
        }

        return res.status(201).json({
            success: true,
            message: `Vendor Review Done Successfully`,
            data: {},
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "vendor.controller.js -> getAllVendors"
            },
        });
    }
};

const getNewVendorCode = async (country: string) => {
    let prefix;
    if (country != "India")
        prefix = 'VI-'
    else
        prefix = 'VD-'

    let vendorNum, vendorCode, existingVendor;
    do {
        vendorNum = Math.floor(1000 + Math.random() * 9000);
        vendorCode = prefix + vendorNum;
        existingVendor = await Vendor.findOne({
            where: {
                vendorCode,
            },
        });
    } while (existingVendor)

    return vendorCode;
}
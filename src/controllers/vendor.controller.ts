import { RequestHandler } from "express";
import { Sequelize } from "sequelize-typescript";
import connection from "../db/connection";

import Vendor from "../models/vendor/Vendor";
import File from "../models/File";
import VendorBank from "../models/vendor/VendorBank";
import VendorOther from "../models/vendor/VendorOther";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorAddress from "../models/vendor/VendorAddress";
import SKU from "../models/SKU";
import BuyingOrder from "../models/BuyingOrder";
import { sendMailSetup } from "../utils/mail.service";
import Comment from "../models/Comment";
import VendorProfile from "../models/vendor/VendorProfile";
import Attachment from "../models/attachment/Attachment";
import AttachmentMapping from "../models/attachment/AttachmentMapping";
import VendorAttachments from "../models/vendor/VendorAttachments";

export const vendorRegistrationStart: RequestHandler = async (req, res) => {
    const t = await connection.transaction();

    try {
        const {
            companyName,
            productCategory,
            addressLine1,
            addressLine2,
            country,
            state,
            city,
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

        const vendorCode = await getNewVendorCode(country);

        const vendor = await Vendor.create({
            vendorCode,
            productCategory,
            companyName
        }, { transaction: t });

        const vendorProfile = await VendorProfile.create({
            vendorId: vendor.id,
            createdBy,
        }, { transaction: t });

        const vendorAttachments =  await VendorAttachments.create({
            gstId,
            coiId,
            msmeId,
            tradeMarkId
        })

        await ContactPerson.create({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorProfileId: vendorProfile.id,
        }, { transaction: t });

        await VendorAddress.create({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
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
            if (otherFields?.length > 0) {
                for (let i = 0; i < otherFields.length; i++) {
                    let field = otherFields[i];

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

export const vendorRegistration: RequestHandler = async (req, res) => {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;

        const vendorCode = await getNewVendorCode(country);

        const vendor = await Vendor.create({
            vendorCode,
            productCategory,
            companyName,
            gst,
            coi,
            msme,
            tradeMark,
            createdBy
        })
        if (!vendor)
            return res.status(404).json({
                success: false,
                message: `Some error occured while creating vendor. Please contact our team for it.`
            })

        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            await File.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi',
                coiAttVendorId: vendor.id
            })
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            await File.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme',
                msmeAttVendorId: vendor.id
            })
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            await File.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade',
                tradeMarkAttVendorId: vendor.id
            })
        }

        const gstFile = await File.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst',
            gstAttVendorId: vendor.id
        })
        if (!gstFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            })

        const agreementFile = await File.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement',
            agreementAttVendorId: vendor.id
        })
        if (!agreementFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            })

        const newContactPerson = new ContactPerson({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        })
        const contactPerson = await newContactPerson.save();
        if (!contactPerson)
            return res.status(404).json({
                success: false,
                message: `Unable to create contact person details`
            })

        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');

        const newAdress = new VendorAddress({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode,
            vendorId: vendor.id
        })
        const address = await newAdress.save();
        if (!address)
            return res.status(404).json({
                success: false,
                message: `Unable to create address details`
            })

        const newVendorBank = new VendorBank({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorId: vendor.id
        })
        const vendorBank = await newVendorBank.save();
        if (!vendorBank)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank details`
            })

        const bankProofFile = await File.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof',
            vendorBankId: vendorBank.id
        })
        if (!bankProofFile)
            return res.status(404).json({
                success: false,
                message: `Unable to create bank proof attachments`
            })

        if (otherFields) {
            let otherFieldsObject = JSON.parse(otherFields)
            if (otherFieldsObject?.length > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;

                    const newOtherField = new VendorOther({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor.id
                    })
                    const otherField = await newOtherField.save();
                    if (!otherField)
                        return res.status(404).json({
                            success: false,
                            message: `Unable to create other fields`
                        })
                    if (req.body[`otherFieldsAttachments-${field.key}`]) {
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');

                        otherFile = await File.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            vendorOtherId: otherField.id
                        })
                    }

                }
            }
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
                "source": "vendor.controller.js -> vendorRegistration"
            },
        });
    }
};

export const updateVendorDetails: RequestHandler = async (req, res) => {
    const t = await connection.transaction();

    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, coi, msme, tradeMark, beneficiary, accountNumber, ifsc, bankName, branch, createdBy } = req.body;
        const { vendorCode } = req.params;

        const vendor = await Vendor.findOne({ where: { vendorCode } });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
            });
        }

        await Vendor.update(
            { productCategory, companyName, gst, coi, msme, tradeMark, createdBy },
            { where: { vendorCode }, transaction: t }
        );

        await ContactPerson.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorId: vendor.id },
            transaction: t
        });

        await VendorAddress.update({
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

        await VendorBank.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorId: vendor.id },
            transaction: t
        });

        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Vendor details have been successfully updated.",
            data: {
                vendorId: vendor.id,
                vendorCode,
            },
        });

    } catch (error: any) {
        await t.rollback();

        return res.status(500).json({
            success: false,
            message: error.message,
            data: {
                source: "vendor.controller.js -> updateVendorDetails",
            },
        });
    }
};

export const updateVendor: RequestHandler = async (req, res) => {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        const { vendorCode } = req.params;

        const vendor = await Vendor.findOne({ where: { vendorCode } })

        await Vendor.update(
            { productCategory, companyName, gst, coi, msme, tradeMark, createdBy },
            { where: { vendorCode } }
        );

        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if (coiAttachment) {
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            await File.update({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile
            },
                {
                    where: { fileType: 'coi', coiAttVendorId: vendor?.id }
                })
        }
        if (msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            await File.update({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile
            },
                {
                    where: { fileType: 'msme', msmeAttVendorId: vendor?.id }
                })
        }
        if (tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            await File.update({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile
            },
                {
                    where: { fileType: 'trade', tradeMarkAttVendorId: vendor?.id }
                })
        }

        await File.update({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile
        },
            {
                where: { fileType: 'gst', gstAttVendorId: vendor?.id }
            })

        await File.update({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile
        },
            {
                where: { fileType: 'agreement', agreementAttVendorId: vendor?.id }
            })

        await ContactPerson.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        }, {
            where: { vendorId: vendor?.id }
        })

        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');

        await VendorAddress.update({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode
        }, {
            where: { vendorId: vendor?.id }
        })

        await VendorBank.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        }, {
            where: { vendorId: vendor?.id }
        })

        const vendorBank = await VendorBank.findOne({ where: { vendorId: vendor?.id } })


        await File.update({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile
        },
            {
                where: { fileType: 'bankProof', vendorBankId: vendorBank?.id }
            })

        if (otherFields) {
            await VendorOther.destroy({ where: { vendorId: vendor?.id } })
            let otherFieldsObject = JSON.parse(otherFields)
            if (otherFieldsObject?.length > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;

                    const newOtherField = new VendorOther({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor?.id
                    })
                    const otherField = await newOtherField.save();
                    if (req.body[`otherFieldsAttachments-${field.key}`]) {
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');

                        otherFile = await File.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            vendorOtherId: otherField.id
                        })
                    }

                }
            }
        }

        const mailSent = await sendMailSetup(vendorCode, 'update-vendor', undefined, undefined);

        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your Vendor has been successfully updated`,
                data: [],
            });

        return res.status(404).json({
            success: false,
            message: `Some error occured`
        })

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
            attributes: ['vendorCode', 'companyName', [Sequelize.col('address.state'), 'state'], [Sequelize.col('address.country'), 'country'], 'productCategory'],
            include: [
                {
                    model: VendorAddress,
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
                    model: ContactPerson
                },
                {
                    model: VendorAddress
                },
                {
                    model: VendorBank
                },
                {
                    model: VendorOther
                },
                {
                    model: SKU,
                },
                {
                    model: BuyingOrder
                },
                {
                    model: Comment
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: `Vendor data successfully fetched`,
            data: { vendor },
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
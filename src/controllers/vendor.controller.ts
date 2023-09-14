import { RequestHandler } from "express";
import { Sequelize } from "sequelize-typescript";
import jwt from "jsonwebtoken";

import Vendor from "../models/Vendor";
import File from "../models/File";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";
import ContactPerson from "../models/ContactPerson";
import VendorAddress from "../models/VendorAddress";
import SKU from "../models/SKU";
import BuyingOrder from "../models/BuyingOrder";
import { MailOptions, sendMail } from "../utils/mail.service";
import { mailDetails } from "../config/emailConfig";
import Comment from "../models/Comment";
const JWTKEY: string = process.env.JWTKEY || "MYNAME-IS-HELLOWORLD";

export const vendorRegistration: RequestHandler = async (req, res) => {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        
        const vendorCode = await getNewVendorCode(country);
        
        const newVendor = new Vendor({
            vendorCode,
            productCategory,
            companyName,
            gst,
            coi,
            msme,
            tradeMark,
            createdBy
        })
        const vendor = await newVendor.save();
        if(!vendor)
        return res.status(404).json({
            success: false,
            message: `Unable to create vendor details`
        })
        
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if(coiAttachment){
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            await File.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi',
                coiAttVendorId: vendor.id
            })    
        }    
        if(msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            await File.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme',
                msmeAttVendorId: vendor.id
            })    
        }    
        if(tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            await File.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade',
                tradeAttVendorId: vendor.id
            })    
        }
        
        const gstFile = await File.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst',
            gstAttVendorId: vendor.id
        })    
        if(!gstFile)
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
        if(!agreementFile)
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
        if(!contactPerson)
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
        if(!address)
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
        if(!vendorBank)
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
        if(!bankProofFile)
        return res.status(404).json({
            success: false,
            message: `Unable to create bank proof attachments`
        })

        if(otherFields){
            let otherFieldsObject = JSON.parse(otherFields)
            if(otherFieldsObject?.length > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;

                    const newOtherField = new VendorOther({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor.id
                    })
                    const otherField = await newOtherField.save();
                    if(!otherField)
                    return res.status(404).json({
                        success: false,
                        message: `Unable to create other fields`
                    })
                    if(req.body[`otherFieldsAttachments-${field.key}`]){
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
        
                        otherFile = await File.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            otherAttVendorId: otherField.id
                        })
                    }
    
                }
            }
        }

        const mailSent = await sendMailSetup(vendor.vendorCode, 'new-vendor', undefined, undefined);

        console.log(mailSent)
        
        if(mailSent)
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

export const updateVendor: RequestHandler = async (req, res) => {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields, createdBy } = req.body;
        const { vendorCode } = req.params;

        const vendor = await Vendor.findOne({where: { vendorCode }})

        await Vendor.update(
            { productCategory, companyName, gst, coi, msme, tradeMark, createdBy },
            { where: { vendorCode } }
        );
        
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if(coiAttachment){
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            await File.update({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile
            },
            {
                where: { fileType: 'coi', coiAttVendorId: vendor?.id}
            })    
        }    
        if(msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            await File.update({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile
            },
            {
                where: { fileType: 'msme', msmeAttVendorId: vendor?.id}
            })    
        }    
        if(tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            await File.update({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile
            },
            {
                where: { fileType: 'trade', tradeAttVendorId: vendor?.id}
            })    
        }    
        
        await File.update({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile
        },
        {
            where: { fileType: 'gst', gstAttVendorId: vendor?.id}
        })    

        await File.update({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile
        },
        {
            where: { fileType: 'agreement', agreementAttVendorId: vendor?.id}
        })    

        await ContactPerson.update({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone
        },{
            where: { vendorId: vendor?.id}
        })

        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');

        await VendorAddress.update({
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            postalCode
        },{
            where: { vendorId: vendor?.id}
        })

        await VendorBank.update({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch
        },{
            where: { vendorId: vendor?.id}
        })

        const vendorBank = await VendorBank.findOne({where: {vendorId: vendor?.id}})


        await File.update({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile
        },
        {
            where: { fileType: 'bankProof', vendorBankId: vendorBank?.id }
        })    

        if(otherFields){
            await VendorOther.destroy({where: {vendorId: vendor?.id}})
            let otherFieldsObject = JSON.parse(otherFields)
            if(otherFieldsObject?.length > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;

                    const newOtherField = new VendorOther({
                        otherKey: field.key,
                        otherValue: field.value,
                        vendorId: vendor?.id
                    })
                    const otherField = await newOtherField.save();
                    if(req.body[`otherFieldsAttachments-${field.key}`]){
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
        
                        otherFile = await File.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other',
                            otherAttVendorId: otherField.id
                        })
                    }
    
                }
            }
        }

        const mailSent = await sendMailSetup(vendorCode, 'update-vendor', undefined, undefined);

        if(mailSent)
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
              ]
        });

        return res.status(201).json({
            success: true,
            message: `Vendors data successfully fetched`,
            data: {vendors},
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
                    model: VendorBank,
                    include: [
                        {
                            model: File
                        }
                    ]
                },
                {
                    model: VendorOther
                },
                {
                    model: SKU
                },
                {
                    model: BuyingOrder
                },
                {
                    model: Comment
                },
                {
                    model: File,
                    as: 'gstAtt' // Add an alias to the File model association
                },
                {
                    model: File,
                    as: 'coiAtt' // Add an alias to the File model association
                },
                {
                    model: File,
                    as: 'msmeAtt' // Add an alias to the File model association
                },
                {
                    model: File,
                    as: 'tradeMarkAtt' // Add an alias to the File model association
                },
                {
                    model: File,
                    as: 'agreementAtt' // Add an alias to the File model association
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: `Vendor data successfully fetched`,
            data: {vendor},
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

export const setValidation: RequestHandler = async (req, res) => {
    try {
        const { vendorCode, isValid, reason } = req.body;
        console.log(vendorCode, isValid, reason)
        const vendor = await Vendor.findOne({
            where: { vendorCode },
            include: [
                {
                    model: ContactPerson
                }
            ]
        });
        if (isValid == "true") {
            const variables = {
                company: vendor?.companyName,
                vendorCode
            }
            await sendMailSetup(null, 'vendor-success', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
            await Vendor.update(
                { isVerified : true },
                { where: { vendorCode } }
            );
        } else {
            const variables = {
                denyReason: reason
            }
            const comment = await Comment.create({
                comment: reason,
                vendorId: vendor?.id,
            })
            await sendMailSetup(vendorCode, 'vendor-fail', variables, vendor?.createdBy ? vendor.createdBy : vendor?.contactPerson.email)
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
    if(country != "India")
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
    } while(existingVendor)

    return vendorCode;
}

const sendMailSetup = async (vendorCode: string | null, type: string, variables: any, sendTo: string | undefined) => {
    const mailOptions: MailOptions = {
        subject: mailDetails[type].subject,
        title: mailDetails[type].title,
        message: getMessage(mailDetails[type].message, variables),
        actionToken: getToken(vendorCode, type),
        closingMessage: mailDetails[type].closingMessage,
        priority: mailDetails[type].priority,
        actionRoute: mailDetails[type].actionRoute,
        actionText: mailDetails[type].actionText
    }
    if(sendTo)
    return await sendMail(sendTo, mailOptions)
    else if(mailDetails[type].sendTo)
    return await sendMail(mailDetails[type].sendTo || "", mailOptions);
    else
    return false;
};

const getMessage = (message: string, variables: { [key: string]: string }): string => {
    if(variables) {
        Object.entries(variables).forEach(([key, value]) => {
            message = message.replace(`$${key}`, value);            
        });
        
    }
    return message;
}

const getToken = (vendorCode: string | null, type: string): string | null => {
    if(vendorCode)
    return jwt.sign({ vendorCode, type }, JWTKEY);
    else
    return null;
}
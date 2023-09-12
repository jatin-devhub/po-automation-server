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

const { VENDOR_VALIDATION_EMAIL, TEST_EMAIL } = process.env;
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
        
        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        if(coiAttachment){
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            await File.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi',
                vendorId: vendor.id
            })    
        }    
        if(msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            await File.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme',
                vendorId: vendor.id
            })    
        }    
        if(tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            await File.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade',
                vendorId: vendor.id
            })    
        }    
        
        await File.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst',
            vendorId: vendor.id
        })    

        await File.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement',
            vendorId: vendor.id
        })    
        
        const newContactPerson = new ContactPerson({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        })
        await newContactPerson.save();

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
        await newAdress.save();

        const newVendorBank = new VendorBank({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            vendorId: vendor.id
        })
        const vendorBank = await newVendorBank.save();


        const bankProofFile = await File.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof',
            vendorBankId: vendorBank.id
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
                    if(req.body[`otherFieldsAttachments-${field.key}`]){
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

        const mailSent = await sendVendorValidationMail(vendor.vendorCode);

        if(mailSent)
        return res.status(201).json({
            success: true,
            message: `Your Vendor has been successfully added`,
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
                "source": "vendor.controller.js -> vendorRegistration"
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
                    model: VendorBank
                },
                {
                    model: VendorOther
                },
                {
                    model: SKU
                },
                {
                    model: BuyingOrder
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

const sendVendorValidationMail = async (vendorCode: string) => {
    const token = jwt.sign({ vendorCode, type: 'newVendor' }, JWTKEY);
    const mailOptions: MailOptions = {
        subject: 'Validate New Vendor Details!!',
        title: 'Vendor Validation',
        message: 'A new vendor is being registered. Please validate the details of the vendor so that further work can be done.',
        actionURL: token,
        closingMessage: ''
    }
    if(TEST_EMAIL)
    return await sendMail(TEST_EMAIL, mailOptions);
    return false;
};
import { RequestHandler } from "express";
import { Vendor } from "../models/Vendor";
import File from "../models/File";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";
import { ContactPerson } from "../models/ContactPerson";
import { VendorAddress } from "../models/VendorAddress";
import { Sequelize } from "sequelize-typescript";
import SKU from "../models/SKU";
import BuyingOrder from "../models/BuyingOrder";

export const vendorRegistration: RequestHandler = async (req, res) => {
    try {
        const { companyName, productCategory, contactPersonName, contactPersonEmail, contactPersonPhone, addressLine1, addressLine2, country, state, city, postalCode, gst, gstAttachment, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields } = req.body;

        const vendorCode = await getNewVendorCode(country);

        const decodedGstFile = Buffer.from(gstAttachment.buffer, 'base64');
        let coiFile = null, msmeFile = null, tradeFile = null
        if(coiAttachment){
            const decodedCoiFile = Buffer.from(coiAttachment.buffer, 'base64');
            coiFile = await File.create({
                fileName: coiAttachment.originalname,
                fileContent: decodedCoiFile,
                fileType: 'coi'
            })
        }
        if(msmeAttachment) {
            const decodedMsmeFile = Buffer.from(msmeAttachment.buffer, 'base64');
            msmeFile = await File.create({
                fileName: msmeAttachment.originalname,
                fileContent: decodedMsmeFile,
                fileType: 'msme'
            })
        }
        if(tradeAttachment) {
            const decodedTradeFile = Buffer.from(tradeAttachment.buffer, 'base64');
            tradeFile = await File.create({
                fileName: tradeAttachment.originalname,
                fileContent: decodedTradeFile,
                fileType: 'trade'
            })
        }
        const decodedAgreementFile = Buffer.from(agreementAttachment.buffer, 'base64');
        const decodedbankFile = Buffer.from(bankAttachment.buffer, 'base64');

        const gstFile = await File.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst'
        })

        const agreementFile = await File.create({
            fileName: agreementAttachment.originalname,
            fileContent: decodedAgreementFile,
            fileType: 'agreement'
        })

        const bankProofFile = await File.create({
            fileName: bankAttachment.originalname,
            fileContent: decodedbankFile,
            fileType: 'bankProof'
        })

        const newVendor = new Vendor({
            vendorCode,
            productCategory,
            companyName,
            gst,
            gstAtt: gstFile.id,
            coi,
            coiAtt: coiFile?.id,
            msme,
            msmeAtt: msmeFile?.id,
            tradeMark,
            tradeMarkAtt: tradeFile?.id,
            agreementAtt: agreementFile.id
        })
        const vendor = await newVendor.save();
        
        const newContactPerson = new ContactPerson({
            name: contactPersonName,
            email: contactPersonEmail,
            phoneNumber: contactPersonPhone,
            vendorId: vendor.id
        })
        const contactPerson = await newContactPerson.save();

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

        const newVendorBank = new VendorBank({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            proofAtt: bankProofFile.id,
            vendorId: vendor.id
        })
        const vendorBank = await newVendorBank.save();

        if(otherFields){
            let otherFieldsObject = JSON.parse(otherFields)
            if(otherFieldsObject?.length > 0) {
                for (let i = 0; i < otherFieldsObject.length; i++) {
                    let field = otherFieldsObject[i], otherFile;
                    if(req.body[`otherFieldsAttachments-${field.key}`]){
                        const decodedOtherFile = Buffer.from(req.body[`otherFieldsAttachments-${field.key}`].buffer, 'base64');
        
                        otherFile = await File.create({
                            fileName: req.body[`otherFieldsAttachments-${field.key}`].originalname,
                            fileContent: decodedOtherFile,
                            fileType: 'other'
                        })
                    }
    
                    const newOtherField = new VendorOther({
                        otherKey: field.key,
                        otherValue: field.value,
                        otherAtt: otherFile?.id,
                        vendorId: vendor.id
                    })
                    const otherField = newOtherField.save();
                }
            }
        }

        return res.status(201).json({
            success: true,
            message: `Your Vendor has been successfully added`,
            data: [],
        });

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
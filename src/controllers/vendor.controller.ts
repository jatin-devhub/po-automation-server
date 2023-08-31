import { RequestHandler } from "express";
import { Vendor } from "../models/Vendor";
import File from "../models/File";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";

export const vendorRegistration: RequestHandler = async (req, res) => {
    try {
        const { isInternational, companyName, gst, gstAttachment, address, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields } = req.body;

        const vendorCode = await getNewVendorCode(isInternational);

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
            companyName,
            gst,
            gstAtt: gstFile.id,
            address,
            coi,
            coiAtt: coiFile?.id,
            msme,
            msmeAtt: msmeFile?.id,
            tradeMark,
            tradeMarkAtt: tradeFile?.id,
            agreementAtt: agreementFile.id
        })
        const vendor = await newVendor.save();
        
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
            attributes: ['vendorCode', 'companyName']
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
                "source": "vendor.controller.js -> vendorRegistration"
            },
        });
    }
};

const getNewVendorCode = async (isInternational: boolean) => {
    let prefix;
    if(isInternational)
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
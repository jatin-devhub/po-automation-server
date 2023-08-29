import { RequestHandler } from "express";
import { Vendor } from "../models/Vendor";
import File from "../models/File";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";

export const vendorRegistration: RequestHandler = async (req, res) => {
    try {
        const { isInternational, companyName, gst, gstAttachment, address, coi, coiAttachment, msme, msmeAttachment, tradeMark, tradeAttachment, agreementAttachment, beneficiary, accountNumber, ifsc, bankName, branch, bankAttachment, otherFields } = req.body;

        const vendorCode = await getNewVendorCode(isInternational);

        const decodedGstFile = Buffer.from(gstAttachment, 'base64');
        const decodedCoiFile = Buffer.from(coiAttachment, 'base64');
        const decodedMsmeFile = Buffer.from(msmeAttachment, 'base64');
        const decodedTradeFile = Buffer.from(tradeAttachment, 'base64');
        const decodedAgreementFile = Buffer.from(agreementAttachment, 'base64');
        const decodedbankFile = Buffer.from(bankAttachment, 'base64');

        const gstFile = await File.create({
            fileName: gstAttachment.originalname,
            fileContent: decodedGstFile,
            fileType: 'gst'
        })

        const coiFile = await File.create({
            fileName: coiAttachment.originalname,
            fileContent: decodedCoiFile,
            fileType: 'coi'
        })

        const msmeFile = await File.create({
            fileName: msmeAttachment.originalname,
            fileContent: decodedMsmeFile,
            fileType: 'msme'
        })

        const tradeFile = await File.create({
            fileName: tradeAttachment.originalname,
            fileContent: decodedTradeFile,
            fileType: 'trade'
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
            coiAtt: coiFile.id,
            msme,
            msmeAtt: msmeFile.id,
            tradeMark,
            tradeMarkAtt: tradeFile.id,
            agreementAtt: agreementFile.id
        })

        const newVendorBank = new VendorBank({
            beneficiaryName: beneficiary,
            accountNumber,
            ifsc,
            bankName,
            branch,
            proofAtt: bankProofFile.id,
            vendorId: newVendor.id
        })

        if(otherFields?.length > 0) {
            for (let i = 0; i < otherFields.length; i++) {
                const field = otherFields[i];
                const decodedOtherFile = Buffer.from(field.attachment, 'base64');

                const otherFile = await File.create({
                    fileName: field.attachment.originalname,
                    fileContent: decodedOtherFile,
                    fileType: 'other'
                })

                const newOtherField = new VendorOther({
                    otherKey: field.key,
                    otherValue: field.value,
                    otherAtt: otherFile.id,
                    vendorId: newVendor.id
                })
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
            data: [],
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
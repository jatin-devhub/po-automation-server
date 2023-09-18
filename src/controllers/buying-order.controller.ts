import { RequestHandler } from "express";
import Vendor from "../models/Vendor";
import BuyingOrder from "../models/BuyingOrder";
import BuyingOrderRecord from "../models/BuyingOrderRecord";
import SKU from "../models/SKU";
import File from "../models/File";
import { sendMailSetup } from "../utils/mail.service";

export const newBuyingOrder: RequestHandler = async (req, res) => {
    try {
        const { poCode, currency, paymentTerms, estimatedDeliveryDate, records, vendorCode, createdBy, poAttachment } = req.body;

        const vendor = await Vendor.findOne({ where: { vendorCode } })

        const decodedPOFile = Buffer.from(poAttachment.buffer, 'base64');

        const newBuyingOrder = new BuyingOrder({
            poCode,
            currency,
            paymentTerms,
            estimatedDeliveryDate,
            createdBy,
            verificationLevel: 'Buyer',
            vendorId: vendor?.id
        })
        const buyingOrder = await newBuyingOrder.save();

        if (buyingOrder) {
            const recordsObject = JSON.parse(records);
            for (let i = 0; i < recordsObject.length; i++) {
                const { skuCode, expectedQty, unitCost, gst } = recordsObject[i];

                const sku = await SKU.findOne({ where: { skuCode } })
                const newBuyingOrderRecord = new BuyingOrderRecord({
                    expectedQty,
                    unitCost,
                    gst,
                    buyingOrderId: buyingOrder.id,
                    skuId: sku?.id
                });
                const buyingOrderRecord = await newBuyingOrderRecord.save();
            }
        }

        const poFile = await File.create({
            fileName: poAttachment.originalname,
            fileContent: decodedPOFile,
            filetype: 'PO',
            buyingOrderId: buyingOrder.id
        })

        const mailSent = await sendMailSetup(buyingOrder.poCode, 'buyer-approval', undefined, undefined, poFile);

        if (mailSent)
            return res.status(201).json({
                success: true,
                message: `Your BuyingOrder request has been successfully added`,
                data: { buyingOrder },
            });
        else
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
                "source": "buying-order.controller.js -> newBuyingOrder"
            },
        });
    }
};

export const getUniquePOCodeRoute: RequestHandler = async (req, res) => {
    try {
        const poCode = await getUniquePOCode();

        return res.status(201).json({
            success: true,
            message: `Your POCode has been created`,
            data: { poCode },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "buying-order.controller.js -> getUniquePOCodeRoute"
            },
        });
    }
};

export const applyReview: RequestHandler = async (req, res) => {
    try {
        const { poCode, isValid, reason } = req.body;

        const buyingOrder = await BuyingOrder.findOne({ where: { poCode } })

        const poFile = await File.findOne({ where: { buyingOrderId: buyingOrder?.id } }) || undefined

        if (isValid == "true") {
            if (buyingOrder?.verificationLevel == "Buyer") {
                await sendMailSetup(buyingOrder?.poCode, 'account-approval', undefined, undefined, poFile);
                await BuyingOrder.update(
                    { verificationLevel: 'Accounts' },
                    { where: { poCode } }
                );
            }
            else if(buyingOrder?.verificationLevel == "Accounts") {
                await sendMailSetup(buyingOrder?.poCode, 'bu-approval', undefined, undefined, poFile);
                await BuyingOrder.update(
                    { verificationLevel: 'BOHead' },
                    { where: { poCode } }
                );
            }
            else if(buyingOrder?.verificationLevel == "BOHead") {
                await sendMailSetup(null, 'po-success', undefined, buyingOrder?.createdBy)
                await BuyingOrder.update(
                    { isVerified: true },
                    { where: { poCode } }
                );
            }

        }
        else {
            const variables = {
                denyReason: reason
            }
            await sendMailSetup(null, 'po-fail', variables, buyingOrder?.createdBy)
            await BuyingOrder.destroy({ where: { isVerified: false, poCode } })
        }


        return res.status(201).json({
            success: true,
            message: `Your review is done`,
            data: {},
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> applyReview"
            },
        });
    }

}

const getUniquePOCode = async () => {
    let poCode, existingPO
    do {
        poCode = `PO-${Math.floor(1000 + Math.random() * 9000)}`
        existingPO = await BuyingOrder.findOne({
            where: {
                poCode,
            },
        });
    } while (existingPO)
    return poCode
}

// export const getAllVendors: RequestHandler = async (req, res) => {
//     try {
//         const vendors = await Vendor.findAll({
//             attributes: ['vendorCode', 'companyName', [Sequelize.col('address.state'), 'state'], [Sequelize.col('address.country'), 'country'], 'productCategory'],
//             include: [
//                 {
//                   model: VendorAddress,
//                   attributes: [],
//                 },
//               ]
//         });

//         return res.status(201).json({
//             success: true,
//             message: `Vendors data successfully fetched`,
//             data: {vendors},
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
import { RequestHandler } from "express";
import { Vendor } from "../models/Vendor";
import BuyingOrder from "../models/BuyingOrder";
import BuyingOrderRecord from "../models/BuyingOrderRecord";
import SKU from "../models/SKU";

export const newBuyingOrder: RequestHandler = async (req, res) => {
    try {
        const { currency, paymentTerms, estimatedDeliveryDate, records, vendorCode } = req.body;
        
        const vendor = await Vendor.findOne({where: { vendorCode }})

        const newBuyingOrder = new BuyingOrder({
            currency,
            paymentTerms,
            estimatedDeliveryDate,
            vendorId: vendor?.id
        })
        const buyingOrder = await newBuyingOrder.save();
        
        if(buyingOrder) {
            const recordsObject = JSON.parse(records);
            for (let i = 0; i < recordsObject.length; i++) {
                const { skuCode, expectedQty, unitCost, gst } = recordsObject[i];

                const sku = await SKU.findOne({ where: { skuCode }})
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
        return res.status(201).json({
            success: true,
            message: `Your BuyingOrder has been successfully added`,
            data: [],
        });

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
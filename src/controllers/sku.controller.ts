import { RequestHandler } from "express";
import Vendor from "../models/Vendor";
import SKU from "../models/SKU";

export const skuRegistration: RequestHandler = async (req, res) => {
    try {
        const { skuCode, category, brand, productTitle, hsn, ean, modelNumber, size, colorFamilyColor, productLengthCm, productBreadthCm, productHeightCm, productWeightKg, masterCartonQty, masterCartonLengthCm, masterCartonBreadthCm, masterCartonHeightCm, masterCartonWeightKg, MRP, vendorCode } = req.body;
        
        const vendor = await Vendor.findOne({where: { vendorCode }})

        const newSkU = new SKU({
            skuCode,
            category,
            brand,
            productTitle,
            hsn,
            ean,
            modelNumber,
            size,
            colorFamilyColor,
            productLengthCm,
            productBreadthCm,
            productHeightCm,
            productWeightKg,
            masterCartonQty,
            masterCartonLengthCm,
            masterCartonBreadthCm,
            masterCartonHeightCm,
            masterCartonWeightKg,
            MRP,
            vendorId: vendor?.id
        })
        const sku = await newSkU.save();
        
        if(sku)
        return res.status(201).json({
            success: true,
            message: `Your SKU has been successfully added`,
            data: [],
        });

        return res.status(404).json({
            success: false,
            message: `Some error occured in sku.controller.js -> skuRegistration`
        })

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "sku.controller.js -> skuRegistration"
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
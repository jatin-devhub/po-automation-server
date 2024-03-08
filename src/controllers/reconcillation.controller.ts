import { RequestHandler } from "express";
import Vendor from "../models/Vendor";
import BuyingOrder from "../models/BuyingOrder";
import BuyingOrderRecord from "../models/BuyingOrderRecord";
import { Sequelize } from "sequelize";
import SKU from "../models/SKU";

export const getApprovedPOs: RequestHandler = async (req, res) => {
    try {
        const buyingOrders: any[] = await BuyingOrder.findAll({
            where: { isVerified: true },
            attributes: ['id', 'poCode', [Sequelize.col('vendor.vendorCode'), 'vendorCode'], [Sequelize.col('vendor.companyName'), 'vendorName']],
            include: [
                {
                    model: Vendor,
                },
                {
                    model: BuyingOrderRecord
                }
            ]
        })

        const transformedBuyingOrders: any[] = []
        for (let i = 0; i < buyingOrders.length; i++) {
            const buyingOrder = buyingOrders[i];
            const transformedBuyingOrder = {
                id: buyingOrder.id,
                poCode: buyingOrder.poCode,
                vendorCode: buyingOrder.vendor.vendorCode,
                vendorName: buyingOrder.vendor.companyName,
                units: buyingOrder.records.reduce((sum: number, record: any) => sum + record.expectedQty, 0),
                amount: buyingOrder.records.reduce((sum: number, record: any) => {
                    const costPerUnit = parseFloat(record.unitCost);
                    const gstPercentage = parseFloat(record.gst) / 100;
                    const totalCostPerItem = costPerUnit + (costPerUnit * gstPercentage);
                    return sum + (totalCostPerItem * record.expectedQty);
                }, 0),
                status: buyingOrder.closed ? 'closed' : 'open'
            }
            transformedBuyingOrders.push(transformedBuyingOrder)
        }

        return res.status(201).json({
            success: true,
            message: `Your pos have been fetched`,
            data: { pos: transformedBuyingOrders },
        });
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> getApprovedPOs"
            },
        });
    }
}

export const getPODetailsForReconcillation: RequestHandler = async (req, res) => {
    try {
        const { poCode } = req.params;

        const buyingOrder = await BuyingOrder.findOne({
            where: { poCode }, include: [
                {
                    model: Vendor,
                }
            ]
        })
        const poRecords = await BuyingOrderRecord.findAll({
            where: { buyingOrderId: buyingOrder?.id },
            attributes: [[Sequelize.col('sku.skuCode'), 'skuCode'], [Sequelize.col('sku.productTitle'), 'productTitle'], [Sequelize.col('sku.category'), 'category'], [Sequelize.col('sku.brand'), 'brand'], [Sequelize.col('sku.colorFamilyColor'), 'colorFamilyColor'], [Sequelize.col('expectedQty'), 'eQty'], 'unitCost', [Sequelize.literal('(`unitCost` * `gst`) / 100'), 'totalGST'], 'gst'],
            include: [
                {
                    model: SKU
                }
            ]
        })

        // const poFile = await File.findOne({ where: { buyingOrderId: buyingOrder?.id } }) || undefined

        // const vendor = await Vendor.findOne({where: {}})


        return res.status(201).json({
            success: true,
            message: `Your details have been fetched`,
            data: { buyingOrder, poRecords },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "reconcillation.controller.js -> getPODetailsForReconcillation"
            },
        });
    }
}
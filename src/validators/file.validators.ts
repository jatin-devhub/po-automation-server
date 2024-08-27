import { RequestHandler } from "express";
import Joi from "joi";

export const validateGetFile: RequestHandler = async (req, res, next) => {
    try {
        const validateVendorCode = Joi.object({
            idType: Joi.string().required(),
            id: Joi.string().required()
        })

        const value = await validateVendorCode.validateAsync(req.params);
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateUpdateFile: RequestHandler = async (req, res, next) => {
    try {
        const updateFileBody = Joi.object({
            attachment: Joi.any().required(), 
            idName: Joi.string().required(), 
            idValue: Joi.number().required()
        })
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
                req.body[file.fieldname] = file
        }
        await updateFileBody.validateAsync(req.body)
        next()
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateNewFile: RequestHandler = async (req, res, next) => {
    try {
        const newFileBody = Joi.object({
            attachmentChunk: Joi.any().required(), 
            chunkIndex: Joi.number().required(),
            totalChunks: Joi.number().required(),
            fileName: Joi.string().required()
        })
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
                req.body[file.fieldname] = file
        }
        await newFileBody.validateAsync(req.body)
        next()
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

// export const validateNewFileChunk: RequestHandler = async (req, res, next) => {
//     try {
//         const newFileChunk = Joi.object({
//             attachmentChunk: Joi.any().required()
//         })
//         console.log('validating')
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await newFileChunk.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }
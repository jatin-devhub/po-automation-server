import { RequestHandler } from "express";
import Joi from "joi";
import Attachment from "../models/attachment/Attachment";

export const validateAttachmentInit: RequestHandler = async (req, res, next) => {
    try {
        const AttachmentInitSchema = Joi.object({
            name: Joi.string().required(),
            mimeType: Joi.string().required(),
            totalSizeInBytes: Joi.number().required(),
            totalChunks: Joi.number().required(),
            attachmentType: Joi.string().required(),
            entityName: Joi.string().required(),
            entityId: Joi.number().required()
        });
        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "No body found",
                data: [],
            });
        AttachmentInitSchema.validate(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details?.map((err: any) => err.message) || [error.message],
        });
    }
}

export const validateUploadChunk: RequestHandler = async (req, res, next) => {
    try {
        const chunkUploadSchema = Joi.object({
            attachmentId: Joi.number().required(),
            chunkIndex: Joi.number().required(),
        })

        if (req.files?.length == 0)
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
                data: {},
            });

        if (!req.body)
            return res.status(400).json({
                success: false,
                message: "No body found",
                data: [],
            });
        chunkUploadSchema.validate(req.body);
        next();

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateGetChunk: RequestHandler = async (req, res, next) => {
    try {
        const getChunkSchema = Joi.object({
            attachmentId: Joi.number().required(),
            chunkIndex: Joi.number().required()
        })

        const { error, value } = getChunkSchema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: [],
            });
        }
        const attachment = await Attachment.findOne({ where: { id: value.attachmentId } });
        if (!attachment)
            return res.status(400).json({
                success: false,
                message: "Attachment not found",
                data: [],
            });
        if (attachment.totalChunks <= value.chunkIndex)
            return res.status(400).json({
                success: false,
                message: "Chunk not found",
                data: [],
            });
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

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

// export const validateUpdateFile: RequestHandler = async (req, res, next) => {
//     try {
//         const updateFileBody = Joi.object({
//             attachment: Joi.any().required(),
//             idName: Joi.string().required(),
//             idValue: Joi.number().required()
//         })
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await updateFileBody.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }

// export const validateNewFile: RequestHandler = async (req, res, next) => {
//     try {
//         const newFileBody = Joi.object({
//             attachmentChunk: Joi.any().required(),
//             chunkIndex: Joi.number().required(),
//             totalChunks: Joi.number().required(),
//             fileName: Joi.string().required()
//         })
//         const files = req.files as Express.Multer.File[];
//         for (const file of files) {
//                 req.body[file.fieldname] = file
//         }
//         await newFileBody.validateAsync(req.body)
//         next()
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: [],
//         });
//     }
// }

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
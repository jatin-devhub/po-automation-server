import { RequestHandler } from "express";
import File from "../models/File";

export const getFile: RequestHandler = async (req, res) => {
    try {
        const { idType, id } = req.params;

        const condn: { [key: string]: string } = {};
        condn[idType] = id;


        const file = await File.findOne({ where: condn })
        let newFile
        if (file) {
            newFile = file.fileContent.toString('base64');
            return res.status(201).json({
                success: true,
                message: `File fetched successfully`,
                data: {
                    file: {
                        fileName: file?.fileName,
                        fileContent: newFile
                    }
                },
            });
        }
        else {
            return res.status(200).json({
                success: false,
                message: `File Not Found`
            })
        }

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "file.controller.js -> getFile"
            },
        });
    }
};

export const updateFile: RequestHandler = async (req, res) => {
    try {
        const { attachment, idName, idValue } = req.body;
        const { idType } = req.params;

        const decodedFile = Buffer.from(attachment.buffer, 'base64');

        let file = await File.findOne({
            where: {
                fileContent: idType,
                [idName]: idValue
            }
        })

        if (file) {
            await file.update({
                fileName: attachment.originalname,
                fileContent: decodedFile
            },
                {
                    where: {
                        fileContent: idType,
                        [idName]: idValue
                    }
                })
        }
        else
            file = await File.create({
                fileName: attachment.originalname,
                fileContent: decodedFile,
                fileType: idType,
                [idName]: idValue
            })

        if (file) {
            return res.status(201).json({
                success: true,
                message: 'File updated Successfully',
                data: {
                    fileId: file.id
                }
            })
        }
        else
            return res.status(400).json({
                success: false,
                message: 'Some error occured while adding new File'
            })
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "file.controller.js -> updateFile"
            },
        });
    }
}

export const newFile: RequestHandler = async (req, res) => {
    try {
        const { attachment } = req.body;
        const { idType } = req.params;

        const decodedFile = Buffer.from(attachment.buffer, 'base64');

        const file = await File.create({
            fileName: attachment.originalname,
            fileContent: decodedFile,
            fileType: idType
        })

        if (file) {
            return res.status(201).json({
                success: true,
                message: 'File created Successfully',
                data: {
                    fileId: file.id
                }
            })
        }
        else
            return res.status(400).json({
                success: false,
                message: 'Some error occured while adding new File'
            })
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "file.controller.js -> updateFile"
            },
        });
    }
}
import { RequestHandler } from "express";
import File from "../models/File";
// import FileChunk from "../models/FileChunk";

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

export const updateOrAddFileWithReference: RequestHandler = async (req, res) => {
    try {
        const { idType, referenceIdType, referenceId } = req.params;
        const { attachment } = req.body;
        const decodedFile = Buffer.from(attachment.buffer, 'base64');
        const file = await File.upsert({
            fileName: attachment.originalname,
            fileContent: decodedFile,
            fileType: idType,
            [referenceIdType]: referenceId
        })

        if (file[0]) {
            return res.status(201).json({
                success: true,
                message: 'File updated pSuccessfully',
                data: {
                    fileId: file[0].id
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
                "source": "file.controller.js -> updateOrAddFileWithReference"
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
                "source": "file.controller.ts -> newFile"
            },
        });
    }
}

// export const newFileChunk: RequestHandler = async (req, res) => {
//     try {
//         const { attachmentChunk } = req.body;

//         const decodedFileChunk = Buffer.from(attachmentChunk.buffer, 'base64');

//         const fileChunk = await FileChunk.create({
//             chunkContent: decodedFileChunk
//         })

//         if (fileChunk)
//             return res.status(201).json({
//                 success: true,
//                 message: 'File Chunk created successfully',
//                 data: {
//                     chunkId: fileChunk.id
//                 }
//             })
//         else
//             return res.status(400).json({
//                 success: false,
//                 message: 'Some error occured while adding file chunk.'
//             })
//     } catch (error: any) {
//         return res.status(504).json({
//             success: false,
//             message: error.message,
//             data: {
//                 "source": "file.controller.ts -> newFileChunk"
//             }
//         })
//     }
// }
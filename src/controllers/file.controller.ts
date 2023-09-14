import { RequestHandler } from "express";
import File from "../models/File";

export const getFile: RequestHandler = async (req, res) => {
    try {
        const { idType, id } = req.params;

        const condn: { [key: string]: string } = {};
        condn[idType] = id;

        
        const file = await File.findOne({ where: condn })

        return res.status(201).json({
            success: true,
            message: `File fetched successfully`,
            data: {file: file},
        });

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
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWTKEY: string = process.env.JWTKEY || "MYNAME-IS-HELLOWORLD";

export const login: RequestHandler = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const token = jwt.sign(
            { userName, password },
            JWTKEY
        );

        return res.status(201).json({
            success: true,
            message: `Login success`,
            data: {
                token
            },
        });

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "auth.controller.js -> login"
            },
        });
    }
};
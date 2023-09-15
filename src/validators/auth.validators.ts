import { RequestHandler } from "express";
import Joi from "joi";

export const validateLogin: RequestHandler = async (req, res, next) => {
    try {
        const validateLogin = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required()
        })

        const value = await validateLogin.validateAsync(req.body);
        const { userName, password } = value;
        if(userName == "plugin" && password == "Plugin123")
        next();
        else
        return res.status(404).json({
            success: false,
            message: "Either username or password incorrect",
            data: {}
        })

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}
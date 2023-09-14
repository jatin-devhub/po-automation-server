import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_PORT, MAIL_EMAIL, MAIL_PASS, FRONTEND_BASE_URL } = process.env

export interface MailOptions {
    subject: string,
    title: string,
    message: string,
    actionToken: string | null,
    closingMessage: string | undefined,
    priority: "high"|"normal"|"low" | undefined,
    actionRoute?: string,
    actionText?: string
}

export const sendMail = async (email: string, mailOptions: MailOptions) => {
    try {
        let transport = nodemailer.createTransport({
            host: MAIL_HOST,
            port: Number(MAIL_PORT) | 0,
            auth: {
              user: MAIL_EMAIL,
              pass: MAIL_PASS
            }
        });
        const mailOption: {
            from: string | undefined,
            to: string,
            subject: string,
            priority: "high"|"normal"|"low" | undefined,
            html: string
        } = {
            from: MAIL_EMAIL,
            to: email,
            subject: mailOptions.subject,
            priority: mailOptions.priority,
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title>${mailOptions.title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #555555;
                        white-space: pre;
                    }
                    a {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 3px;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${mailOptions.title}</h1>
                    <p>Dear User,</p>
                    <p>${mailOptions.message}</p>
                    ${mailOptions.actionToken? `<p><a href="${FRONTEND_BASE_URL}/${mailOptions.actionRoute}/${mailOptions.actionToken}">${mailOptions.actionText}</a></p>`: ""}                    
                    <p>${mailOptions.closingMessage?mailOptions.closingMessage:""}</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>Global Plugin</p>
                </div>
            </body>
            </html>`
        };
        transport.sendMail(mailOption, (err, mailed) => {
            if (err) {
                console.log(err.message);
                return false;
            } else {
                console.log(`Email has been Sent :- `, mailed.response);
                return true;
            }
        });
    } catch (error: any) {
        console.log(error.message);
        return false;
    }
};
import nodemailer from 'nodemailer';
import { object, string } from 'yup';
import { EmailData } from '../models/EmailData';
import { fetchSecretKey } from './fetchSecretKey';

const secretName = 'prod/email-secrets';
const emailKeysObjectSchema = object({
    SMTP_HOST: string().required(),
    SMTP_USER: string().required(),
    SMTP_PASSWORD: string().required(),
    SITE_EMAIL_ADDRESS: string().required(),
})

export const sendEmail = async (emailData: EmailData, sendTo: string) => {
    try {
        const apiKeysObject = await fetchSecretKey(secretName);
        emailKeysObjectSchema.validateSync(apiKeysObject);
        const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SITE_EMAIL_ADDRESS } = apiKeysObject;

        const { message, subject } = emailData;
        const transporter = nodemailer.createTransport({
            port: 465,
            host: SMTP_HOST,
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `CPS <${SITE_EMAIL_ADDRESS}>`,
            sender: SITE_EMAIL_ADDRESS,
            to: sendTo,
            subject,
            text: message,
        });
    }
    catch (e) {
        console.info(e);
        throw new Error(`Failed to send Email to ${sendTo}`);
    }
};
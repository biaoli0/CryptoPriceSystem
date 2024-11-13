import nodemailer from 'nodemailer';
import { EmailData } from '../models/EmailData';
import { fetchSecretKey } from '../utils/fetchSecretKey';

const secretName = 'prod/email-secrets';

export const sendEmail = async (emailData: EmailData, sendTo: string) => {
    try {
        const { message, subject } = emailData;
        const apiKeysObject = await fetchSecretKey(secretName);

        const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SITE_EMAIL_ADDRESS } = apiKeysObject;
        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SITE_EMAIL_ADDRESS) {
            throw new Error('Failed to retrieve Email secrets');
        }

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
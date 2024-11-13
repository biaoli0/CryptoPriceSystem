export type EmailRequest = {
    sender?: string,
    recipient: string | string[],
    subject: string,
    bodyText: string,
}
import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";

export const generateEmailMessageForPriceRequest = (data: CoinCurrentPriceData) => {
    const localDateTime = data.date.toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        timeStyle: 'long'
    });

    const message = `
Hi,
As per your requested on ${localDateTime}, the price of ${data.name}(id: ${data.id}) is $${data.price} ${data.currency}.

Best regards
Crypto Price System`;
    const subject = `Update: Current ${data.name}(id: ${data.id}) Price`;

    return { message, subject };
}
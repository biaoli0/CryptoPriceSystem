import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";
import { toLocalDateTime } from "./toLocalDateTime";

export const generateEmailMessageForPriceRequest = (data: CoinCurrentPriceData) => {
    const localDateTime = toLocalDateTime(data.date);

    const message = `
Hi,
As per your requested on ${localDateTime}, the price of ${data.name}(id: ${data.id}) is $${data.price} ${data.currency}.

Best regards
Crypto Price System`;
    const subject = `Update: Current ${data.name}(id: ${data.id}) Price`;

    return { message, subject };
}
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";

export const toSearchRecordsMapper = (items: Record<string, AttributeValue>[]): CoinCurrentPriceData[] => {
    return items.map(item => ({
        date: new Date(Number(item.timestamp.N)),
        price: Number(item.price.N),
        currency: 'aud',
        id: item.coinId.S!,
        name: JSON.parse(item.coinData.S!).name
    }));
}
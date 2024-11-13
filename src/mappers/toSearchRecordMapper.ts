import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";
import { SearchRecord } from "../models/SearchRecord";

export const toSearchRecordMapper = (coinData: CoinCurrentPriceData, userEmail: string): SearchRecord => {
    return {
        price: coinData.price,
        timestamp: coinData.date.getTime(),
        currency: coinData.currency,
        userEmail,
        coinId: coinData.id,
        coinData: {
            name: coinData.name,
        }
    }
}
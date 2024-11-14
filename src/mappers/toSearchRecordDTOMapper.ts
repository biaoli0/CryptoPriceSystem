import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";
import { SearchRecordDTO } from "../models/SearchRecordDTO";

export const toSearchRecordDTOMapper = (coinData: CoinCurrentPriceData, userEmail: string): SearchRecordDTO => {
    return {
        price: {
            N: coinData.price.toString()
        },
        timestamp: {
            N: coinData.date.getTime().toString()
        },
        userEmail: {
            S: userEmail
        },
        coinId: {
            S: coinData.id
        },
        coinData: {
            S: JSON.stringify({ name: coinData.name })
        },
    }
}
import { object, string } from "yup";
import { CoinCurrentPriceData } from "../models/CoinCurrentPriceData";

interface CurrencySchema {
    [key: string]: {
        aud: number;
    };
}

const priceDataParams = object<CurrencySchema>().test(
    'dynamic-currency-fixed-aud',
    'Invalid currency data structure',
    (value) => {
        if (!value || typeof value !== 'object') return false;

        return Object.entries(value).every(([, innerObj]) => {
            if (!innerObj || typeof innerObj !== 'object') return false;
            if (!('aud' in innerObj)) return false;

            return typeof innerObj.aud === 'number';
        });
    }
).required();

const coinDataParams = object({
    id: string().required(),
    name: string().required(),
}).required();

export const coinDataMapper = (priceData: unknown, coinData: unknown): CoinCurrentPriceData => {
    const coin = coinDataParams.validateSync(coinData);
    const price = priceDataParams.validateSync(priceData) as CurrencySchema;
    if (!(coin.id in price)) {
        throw new Error(`Price data ${JSON.stringify(priceData)} do not contain ${coin.id}`);
    }

    return {
        date: new Date(),
        price: price[coin.id].aud,
        currency: 'aud',
        id: coin.id,
        name: coin.name
    }
}
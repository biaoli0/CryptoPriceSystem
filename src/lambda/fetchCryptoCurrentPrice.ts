
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { APIClient } from "../handlers/APIClient";
import { object, string } from "yup";
import { fetchSecretKey } from '../handlers/fetchSecretKey';
import { coinDataMapper } from '../mappers/coinDataMapper';
import { generateEmailMessageForPriceRequest } from '../utils/generateEmailMessageForPriceRequest';
import { sendEmail } from '../handlers/sendEmail';
import { toSearchRecordMapper } from '../mappers/toSearchRecordMapper';
import { storeSearchRecord } from '../handlers/storeSearchRecord';

const baseURL = 'https://api.coingecko.com/api/v3/';
const secretName = "prod/coingecko";
const COIN_GECKO_API_KEY = 'COIN_GECKO_API_KEY';

const queryParamsSchema = object({
    coin: string().required()
});

export const handler: Handler = async (event: APIGatewayEvent) => {
    const apiKeyObject = await fetchSecretKey(secretName);
    if (!apiKeyObject[COIN_GECKO_API_KEY]) {
        throw new Error('Failed to retrieve API key');
    }
    const apiKey = apiKeyObject[COIN_GECKO_API_KEY];

    const queryParams = await queryParamsSchema.validate(event.queryStringParameters);
    const { coin } = queryParams;

    const api = new APIClient({
        baseURL, headers: { 'x-cg-demo-api-key': apiKey }
    });

    const sendTo = 'lbit123@outlook.com';
    const priceResponse = await api.get(`simple/price?ids=${coin}&vs_currencies=aud`);
    const coinDataResponse = await api.get(`coins/${coin}`);
    const currentPriceData = coinDataMapper(priceResponse.data, coinDataResponse.data);
    const emailData = generateEmailMessageForPriceRequest(currentPriceData);
    console.info(`Sending Email to ${sendTo}`);
    await sendEmail(emailData, sendTo);
    const newSearchRecord = toSearchRecordMapper(currentPriceData, sendTo);
    console.info(`Storing new search record: ${JSON.stringify(newSearchRecord)}`);
    await storeSearchRecord(newSearchRecord);
    return api.responseToLambda(`Email successfully sent to ${sendTo}`);
};




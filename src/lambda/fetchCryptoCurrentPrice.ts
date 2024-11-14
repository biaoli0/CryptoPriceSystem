
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { APIClient } from "../handlers/APIClient";
import { object, string } from "yup";
import { fetchSecretKey } from '../handlers/fetchSecretKey';
import { coinDataMapper } from '../mappers/coinDataMapper';
import { generateEmailMessageForPriceRequest } from '../utils/generateEmailMessageForPriceRequest';
import { sendEmail } from '../handlers/sendEmail';
import { toSearchRecordDTOMapper } from '../mappers/toSearchRecordDTOMapper';
import { storeSearchRecord } from '../handlers/storeSearchRecord';
import { responseToLambda } from '../utils/responseToLambda';

const baseURL = 'https://api.coingecko.com/api/v3/';
const secretName = "prod/coingecko";
const COIN_GECKO_API_KEY = 'COIN_GECKO_API_KEY';

const queryParamsSchema = object({
    coin: string().required(),
    email: string().required()
});

export const handler: Handler = async (event: APIGatewayEvent) => {
    const apiKeyObject = await fetchSecretKey(secretName);
    if (!apiKeyObject[COIN_GECKO_API_KEY]) {
        throw new Error('Failed to retrieve API key');
    }
    const apiKey = apiKeyObject[COIN_GECKO_API_KEY];

    const queryParams = await queryParamsSchema.validate(event.queryStringParameters);
    const { coin, email } = queryParams;

    const api = new APIClient({
        baseURL, headers: { 'x-cg-demo-api-key': apiKey }
    });

    const priceResponse = await api.get(`simple/price?ids=${coin}&vs_currencies=aud`);
    const coinDataResponse = await api.get(`coins/${coin}`);
    const currentPriceData = coinDataMapper(priceResponse.data, coinDataResponse.data);
    const emailData = generateEmailMessageForPriceRequest(currentPriceData);
    console.info(`Sending Email to ${email}`);
    await sendEmail(emailData, email);
    const newSearchRecordDTO = toSearchRecordDTOMapper(currentPriceData, email);
    console.info(`Storing new search record: ${JSON.stringify(newSearchRecordDTO)}`);
    await storeSearchRecord(newSearchRecordDTO);
    return responseToLambda(`Email successfully sent to ${email}`);
};





import { APIGatewayEvent, Handler } from 'aws-lambda';
import { fetchSearchRecordsFromDB } from '../handlers/fetchSearchRecords';
import { responseToLambda } from '../utils/responseToLambda';
import { object, string } from 'yup';

const queryParamsSchema = object({
    email: string().required()
});

export const handler: Handler = async (event: APIGatewayEvent) => {
    const queryParams = await queryParamsSchema.validate(event.queryStringParameters);
    const { email } = queryParams;
    const records = await fetchSearchRecordsFromDB(email);
    return responseToLambda(JSON.stringify(records.map(r => {
        return {
            ...r, date: r.date.toLocaleString('en-AU', {
                timeZone: 'Australia/Sydney',
                timeStyle: 'long'
            })
        }
    })));
};




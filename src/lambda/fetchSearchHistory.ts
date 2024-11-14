
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { fetchSearchRecordsFromDB } from '../handlers/fetchSearchRecords';
import { responseToLambda } from '../utils/responseToLambda';

const user = 'lbit123@outlook.com';

export const handler: Handler = async (event: APIGatewayEvent) => {
    const records = await fetchSearchRecordsFromDB(user);
    return responseToLambda(JSON.stringify(records.map(r => {
        return {
            ...r, date: r.date.toLocaleString('en-AU', {
                timeZone: 'Australia/Sydney',
                timeStyle: 'long'
            })
        }
    })));
};




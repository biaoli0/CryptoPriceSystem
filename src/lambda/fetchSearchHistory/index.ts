
import { APIGatewayEvent } from 'aws-lambda';
import { fetchSearchRecordsFromDB } from '../../handlers/fetchSearchRecords';
import { responseToLambda } from '../../utils/responseToLambda';
import { object, string } from 'yup';
import { toLocalDateTime } from '../../utils/toLocalDateTime';

const queryParamsSchema = object({
    email: string().email().required()
});

exports.handler = async (event: APIGatewayEvent) => {
    const queryParams = await queryParamsSchema.validate(event.queryStringParameters);
    const { email } = queryParams;
    const records = await fetchSearchRecordsFromDB(email);
    return responseToLambda(JSON.stringify(records.map(r => {
        return {
            ...r, date: toLocalDateTime(r.date)
        }
    })));
};
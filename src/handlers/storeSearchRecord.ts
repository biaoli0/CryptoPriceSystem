import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SearchRecordDTO } from "../models/SearchRecordDTO";
import { REGION, TABLE_NAME } from '../constants';

export const storeSearchRecord = async (item: SearchRecordDTO): Promise<void> => {
    const input = {
        TableName: TABLE_NAME,
        Item: item
    };
    const dynamoDb = new DynamoDBClient({ region: REGION });

    try {
        const command = new PutItemCommand(input);
        const response = await dynamoDb.send(command);
        console.info('Successfully stored search record:', JSON.stringify(response));
    } catch (error) {
        console.error('Error storing search record:', error);
        throw new Error('Failed to store search record');
    }
};
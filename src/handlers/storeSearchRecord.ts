import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SearchRecord } from "../models/SearchRecord";
import { REGION, TABLE_NAME } from '../constants';

export const storeSearchRecord = async (record: SearchRecord): Promise<void> => {
    const input = {
        TableName: TABLE_NAME,
        Item: {
            price: {
                N: record.price.toString()
            },
            timestamp: {
                N: record.timestamp.toString()
            },
            userEmail: {
                S: record.userEmail
            },
            coinId: {
                S: record.coinId
            },
            coinData: {
                S: JSON.stringify(record.coinData)
            },
        }
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
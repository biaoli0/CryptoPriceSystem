import { DynamoDBClient, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { REGION, TABLE_NAME } from '../constants';
import { toSearchRecordsMapper } from '../mappers/toSearchRecordMapper';
import { CoinCurrentPriceData } from '../models/CoinCurrentPriceData';

export const fetchSearchRecordsFromDB = async (userEmail: string): Promise<CoinCurrentPriceData[]> => {
    const dynamoDb = new DynamoDBClient({ region: REGION });

    const input: QueryCommandInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userEmail = :userEmail',
        ExpressionAttributeValues: {
            ':userEmail': { S: userEmail }
        },
        ScanIndexForward: false,
        Select: 'ALL_ATTRIBUTES',
    };

    try {
        const command = new QueryCommand(input);
        const response = await dynamoDb.send(command);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }
        const searchRecords = toSearchRecordsMapper(response.Items);

        console.info(`Successfully fetched ${searchRecords.length} records for user: ${userEmail}`);
        console.info(`Records: ${JSON.stringify(searchRecords)}`);
        return searchRecords;

    } catch (error) {
        console.error('Error fetching search records:', error);
        throw new Error('Failed to fetch search records');
    }
};

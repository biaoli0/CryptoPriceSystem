import { DynamoDBClient, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { REGION, TABLE_NAME } from '../constants';
import { SearchRecord } from '../models/SearchRecord';

export const fetchSearchRecords = async (userEmail: string): Promise<SearchRecord[]> => {
    const dynamoDb = new DynamoDBClient({ region: REGION });

    const input: QueryCommandInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userEmail = :userEmail',
        ExpressionAttributeValues: {
            ':userEmail': { S: userEmail }
        }
    };

    try {
        const command = new QueryCommand(input);
        const response = await dynamoDb.send(command);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }

        // Transform DynamoDB items into SearchRecord objects
        const records: SearchRecord[] = response.Items.map(item => ({
            userEmail: item.userEmail.S!,
            coinId: item.coinId.S!,
            price: Number(item.price.N),
            timestamp: Number(item.timestamp.N),
            coinData: JSON.parse(item.coinData.S!)
        }));

        console.info(`Successfully fetched ${records.length} records for user: ${userEmail}`);
        return records;

    } catch (error) {
        console.error('Error fetching search records:', error);
        throw new Error('Failed to fetch search records');
    }
};

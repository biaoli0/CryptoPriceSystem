type DynamoDBString = { S: string };
type DynamoDBNumber = { N: string };

export type SearchRecordDTO = {
    price: DynamoDBNumber,
    timestamp: DynamoDBNumber,
    userEmail: DynamoDBString,
    coinId: DynamoDBString,
    coinData: DynamoDBString,
}
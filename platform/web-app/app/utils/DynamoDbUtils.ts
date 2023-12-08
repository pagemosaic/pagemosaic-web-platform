import {camelCase, pick} from 'lodash-es';
import {
    DynamoDBClient,
    UpdateItemInput,
    GetItemCommand,
    UpdateItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb';
import {BasicItem, ItemKey} from 'common-utils';

const AWS_REGION: string | undefined = process.env.AWS_REGION;

let dynamoClient: DynamoDBClient | undefined = undefined;

export function getDynamoClient(): DynamoDBClient {
    if (!dynamoClient) {
        dynamoClient = new DynamoDBClient({region: AWS_REGION});
    }
    return dynamoClient;
}

export async function createOrUpdateItem<T extends BasicItem>(tableName: string, item: T): Promise<T> {
    const dynamoClient = getDynamoClient();
    const foundItem = await getItemByKey(tableName, pick(item, ['PK', 'SK']));
    if (foundItem) {
        const updateParams = prepareItemUpdateParams(tableName, item);
        const updateCommand = new UpdateItemCommand(updateParams);
        await dynamoClient.send(updateCommand);
    } else {
        // create new user profile
        const command = new PutItemCommand({TableName: tableName, Item: item});
        await dynamoClient.send(command);
    }
    return item;
}

export async function getItemByKey<T extends BasicItem>(tableName: string, itemKey: ItemKey): Promise<T | undefined> {
    const dynamoClient = getDynamoClient();
    const selectParams = {
        TableName: tableName,
        Key: itemKey
    };
    const command = new GetItemCommand(selectParams);
    const response = await dynamoClient.send(command);
    if (response.Item) {
        return response.Item as T;
    }
    return undefined;
}

function prepareItemUpdateParams(
    tableName: string,
    item: BasicItem
): UpdateItemInput {
    const {PK, SK, ...restAttributes} = item;
    const updateExpressionParts = [];
    const expressionAttributeValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(restAttributes as Record<string, any>)) {
        const keyValue = `${camelCase(key)}Value`;
        updateExpressionParts.push(`${key} = :${keyValue}`);
        expressionAttributeValues[`:${keyValue}`] = value;
    }
    return {
        TableName: tableName,
        Key: {PK, SK},
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues
    };
}

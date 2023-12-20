import {camelCase, pick, cloneDeep} from 'lodash-es';
import {
    DynamoDBClient,
    UpdateItemInput,
    GetItemCommand,
    UpdateItemCommand,
    PutItemCommand, QueryCommand, QueryCommandInput
} from '@aws-sdk/client-dynamodb';
import {BasicItem, ItemKey} from '../data/BasicItem';
import {DI_EntrySlice, DI_ContentSlice, DI_PageEntry} from '../data/DocumentItem';
import {
    PLATFORM_DOCUMENTS_TABLE_NAME,
    PLATFORM_ENTRIES_BY_TYPE_INDEX_NAME,
    DI_ENTRY_SLICE_KEY,
    DI_CONTENT_SLICE_KEY,
    DI_TAG_SLICE_KEY,
    DI_SLICE_KEYS
} from '../constants';

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

export async function getEntrySliceByEntryType(entryTypeValue: {S: string}): Promise<Array<DI_EntrySlice>> {
    const params: QueryCommandInput = {
        TableName: PLATFORM_DOCUMENTS_TABLE_NAME,
        IndexName: PLATFORM_ENTRIES_BY_TYPE_INDEX_NAME,
        KeyConditionExpression: "#entryTypeField = :entryTypeValue",
        ExpressionAttributeNames: {
            "#entryTypeField": "EntryType",
        },
        ExpressionAttributeValues: {
            ":entryTypeValue": entryTypeValue,
        },
    };
    return await queryWithExponentialBackoff(params) as Array<DI_EntrySlice>;
}

export async function getPageEntriesByKeys(
    keys: Array<{S: string}>,
    slices: Array<typeof DI_SLICE_KEYS[number]>
): Promise<Array<DI_PageEntry>> {
    const result: Array<DI_PageEntry> = [];
    for (const key of keys) {
        const resultItem: DI_PageEntry = {};
        let KeyConditionExpression = `PK = ${key}`;
        if (slices && slices.length > 0) {
            KeyConditionExpression += ' AND (';
            const expressionParts: Array<string> = [];
            for (const slice of slices) {
                expressionParts.push(`begins_with(SK, ${slice})`);
            }
            KeyConditionExpression += ` AND (${expressionParts.join(' OR ')})`;
        }
        const params: QueryCommandInput = {
            TableName: PLATFORM_DOCUMENTS_TABLE_NAME,
            KeyConditionExpression,
        };
        const sliceRecords: Array<BasicItem> = await queryWithExponentialBackoff(params);
        if (sliceRecords && sliceRecords.length > 0) {
            for (const sliceRecord of sliceRecords) {
                if (sliceRecord.SK.S === DI_CONTENT_SLICE_KEY) {
                    resultItem.content = cloneDeep(sliceRecord as DI_ContentSlice);
                } else if (sliceRecord.SK.S === DI_ENTRY_SLICE_KEY) {
                    resultItem.entry = cloneDeep(sliceRecord as DI_EntrySlice);
                }
            }
        }
        result.push(resultItem);
    }
    return result;
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

async function queryWithExponentialBackoff(
    params: QueryCommandInput,
    retries: number = 3, // The maximum number of retries
    backoff: number = 100 // The initial backoff delay is set to 100 milliseconds and doubles with each retry attempt.
): Promise<Array<BasicItem>> {
    const dynamoClient = getDynamoClient();
    try {
        const command = new QueryCommand(params);
        const response = await dynamoClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return response.Items as Array<BasicItem>;
        }
        return [];
    } catch (error: any) {
        if (retries > 0 && (error.name === 'ProvisionedThroughputExceededException' || error.name === 'ThrottlingException')) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return queryWithExponentialBackoff(params, retries - 1, backoff * 2);
        }
        throw error;
    }
}

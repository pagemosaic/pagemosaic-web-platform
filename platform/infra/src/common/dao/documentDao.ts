import {cloneDeep} from 'lodash-es';
import {QueryCommandInput} from '@aws-sdk/client-dynamodb';
import {
    PLATFORM_DOCUMENTS_TABLE_NAME,
    PLATFORM_ENTRIES_BY_TYPE_INDEX_NAME,
    DI_PAGE_ENTRY_SLICE_KEYS,
    DI_CONTENT_SLICE_KEY,
    DI_ENTRY_SLICE_KEY,
    DI_META_SLICE_KEY,
    DI_TAG_SLICE_KEY,
    DI_TAG_ENTRY_SLICE_KEYS,
    DI_DESCRIPTION_SLICE_KEY
} from '../constants';
import {
    DI_EntrySlice,
    DI_PageEntry,
    DI_ContentSlice,
    DI_MetaSlice,
    DI_TagSlice,
    DI_TagEntry,
    DI_DescriptionSlice
} from '../data/DocumentItem';
import {BasicItem, ItemKey} from '../data/BasicItem';
import {queryWithExponentialBackoff} from '../aws/database';

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
    slices: Array<typeof DI_PAGE_ENTRY_SLICE_KEYS[number]>
): Promise<Array<DI_PageEntry>> {
    const result: Array<DI_PageEntry> = [];
    const tagEntriesCache: Record<string, DI_TagEntry> = {};
    for (const key of keys) {
        const resultItem: DI_PageEntry = {};
        if (slices && slices.length > 0) {
            for (const slice of slices) {
                const params: QueryCommandInput = {
                    TableName: PLATFORM_DOCUMENTS_TABLE_NAME,
                    KeyConditionExpression: slice === 'TAG'
                        ? 'PK = :keyValue AND begins_with(SK, :sliceValue)'
                        : 'PK = :keyValue AND SK = :sliceValue',
                    ExpressionAttributeValues: {
                        ':keyValue': key,
                        ':sliceValue': {S: slice}
                    }
                };
                const sliceRecords: Array<BasicItem> = await queryWithExponentialBackoff(params);
                if (sliceRecords && sliceRecords.length > 0) {
                    for (const sliceRecord of sliceRecords) {
                        if (sliceRecord.SK.S === DI_CONTENT_SLICE_KEY) {
                            resultItem.Content = cloneDeep(sliceRecord as DI_ContentSlice);
                        } else if (sliceRecord.SK.S === DI_ENTRY_SLICE_KEY) {
                            resultItem.Entry = cloneDeep(sliceRecord as DI_EntrySlice);
                        } else if (sliceRecord.SK.S === DI_META_SLICE_KEY) {
                            resultItem.Meta = cloneDeep(sliceRecord as DI_MetaSlice);
                        } else if (sliceRecord.SK.S.startsWith(DI_TAG_SLICE_KEY)) {
                            resultItem.Tags = resultItem.Tags || [];
                            resultItem.Tags.push(cloneDeep(sliceRecord) as DI_TagSlice);
                        }
                    }
                }
                if (resultItem.Tags && resultItem.Tags.length > 0) {
                    let foundEntries: Array<DI_TagEntry> = [];
                    const keys: Array<{S: string}> = [];
                    for (const tag of resultItem.Tags) {
                        const foundInCacheEntry: DI_TagEntry | undefined = tagEntriesCache[tag.SK.S];
                        if (foundInCacheEntry) {
                            foundEntries.push(foundInCacheEntry);
                        } else {
                            keys.push(tag.SK);
                        }
                    }
                    foundEntries = foundEntries.concat(
                        await getTagEntriesByKeys(keys)
                    );
                    for (const foundEntry of foundEntries) {
                        tagEntriesCache[foundEntry.Entry.PK.S] = foundEntry;
                    }
                    resultItem.TagEntries = foundEntries;
                }
            }
        }
        result.push(resultItem);
    }
    return result;
}

export async function getTagEntriesByKeys(keys: Array<{S: string}>): Promise<Array<DI_TagEntry>> {
    const result: Array<DI_TagEntry> = [];
    const slices = DI_TAG_ENTRY_SLICE_KEYS;
    for (const key of keys) {
        if (slices && slices.length > 0) {
            let description: DI_DescriptionSlice | undefined = undefined;
            let entry: DI_EntrySlice | undefined = undefined;
            for (const slice of slices) {
                const params: QueryCommandInput = {
                    TableName: PLATFORM_DOCUMENTS_TABLE_NAME,
                    KeyConditionExpression: 'PK = :keyValue AND SK = :sliceValue',
                    ExpressionAttributeValues: {
                        ':keyValue': key,
                        ':sliceValue': {S: slice}
                    }
                };
                console.log('getTagEntriesByKeys params: ', params);
                const sliceRecords: Array<BasicItem> = await queryWithExponentialBackoff(params);
                console.log('Found tag entries: ', sliceRecords);
                if (sliceRecords && sliceRecords.length > 0) {
                    for (const sliceRecord of sliceRecords) {
                        if (sliceRecord.SK.S === DI_DESCRIPTION_SLICE_KEY) {
                            description = cloneDeep(sliceRecord as DI_DescriptionSlice);
                        } else if (sliceRecord.SK.S === DI_ENTRY_SLICE_KEY) {
                            entry = cloneDeep(sliceRecord as DI_EntrySlice);
                        }
                    }
                }
            }
            if (description && entry) {
                result.push({
                    Description: description,
                    Entry: entry
                });
            }
        }
    }
    return result;
}

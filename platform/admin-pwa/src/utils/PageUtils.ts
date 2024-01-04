import {set, get} from 'lodash-es';
import {ContentDataConfigClass} from 'infra-common/data/ContentDataConfig';
import {ContentData, ContentDataField} from 'infra-common/data/ContentData';

export function buildOrUpdateContentObject(config: ContentDataConfigClass, existingObject: ContentData = {}): ContentData {
    const result: ContentData = {};

    config.forEach(blockConfig => {
        const blockPath = blockConfig.code;
        let blockData = get(existingObject, blockPath);

        if (blockConfig.isArray) {
            blockData = Array.isArray(blockData) ? blockData.slice() : [];
        } else {
            // Correctly handle if existing blockData is an array but should not be
            blockData = Array.isArray(blockData) ? {} : blockData ? { ...blockData } : {};
        }

        blockConfig.fields.forEach(fieldConfig => {
            if (blockConfig.isArray) {
                // Initialize each array element if not already initialized
                blockData = blockData.length ? blockData : [{}];

                (blockData as Array<any>).forEach((item: any, index: number) => {
                    const itemPath = `${blockPath}[${index}].${fieldConfig.code}`;
                    let fieldValue = get(existingObject, itemPath, undefined) as ContentDataField | Array<ContentDataField> | undefined;

                    if (fieldValue === undefined || fieldConfig.isArray !== Array.isArray(fieldValue)) {
                        fieldValue = fieldConfig.isArray ? [] : { value: '' };
                    }

                    set(blockData, `[${index}].${fieldConfig.code}`, fieldValue);
                });
            } else {
                const fieldPath = `${blockPath}.${fieldConfig.code}`;
                let fieldValue = get(existingObject, fieldPath, undefined) as ContentDataField | Array<ContentDataField> | undefined;

                if (fieldValue === undefined || fieldConfig.isArray !== Array.isArray(fieldValue)) {
                    fieldValue = fieldConfig.isArray ? [] : { value: '' };
                }

                set(blockData, fieldConfig.code, fieldValue);
            }
        });
        set(result, blockPath, blockData);
    });
    return result;
}


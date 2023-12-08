import localforage from 'localforage';
import {SequentialTaskQueue} from 'sequential-task-queue';

export const sessionStorageTaskQueue = new SequentialTaskQueue();
let storageInstance: LocalForage;

export async function getGlobalState(key: string) {
    let result: any = undefined;
    let stringValue: string | null = sessionStorage.getItem(key);
    if (stringValue) {
        try {
            stringValue = JSON.parse(stringValue);
            result = stringValue;
        } catch (e: any) {
            console.error(`Error reading session storage ${key}. ${e.message}`);
        }
    }
    return result;
}

export async function setGlobalState(key: string, val: any) {
    sessionStorage.setItem(key, JSON.stringify(val));
}

export async function delGlobalState(key: string) {
    sessionStorage.removeItem(key);
}

export async function clearGlobalState() {
    sessionStorage.clear();
}

// export async function keysGlobalState() {
//   return (await dbPromise).getAllKeys('globalState');
// }

export function initStorage() {
    localforage.config({
        name: 'PageMosaicAdminPanel'
    });
}

export function getStorageInstance() {
    if (!storageInstance) {
        initStorage();
        storageInstance = localforage.createInstance({
            name: 'PageMosaicAdminPanelStorage',
        });
    }
    return storageInstance;
}

export async function setStorageRecord(recordObjectKey: string, recordObject: any, storageKey: string): Promise<void> {
    return getStorageInstance().getItem(storageKey)
        .then((record: any) => {
            record = record || {};
            record[recordObjectKey] = recordObject;
            return getStorageInstance().setItem(storageKey, record);
        });
}

export async function getStorageRecord(recordObjectKey: string, storageKey: string): Promise<any> {
    return getStorageInstance().getItem(storageKey)
        .then((record: any) => {
            record = record || {};
            return record[recordObjectKey];
        });
}

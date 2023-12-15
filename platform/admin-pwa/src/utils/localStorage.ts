import localforage from 'localforage';
// import {SequentialTaskQueue} from 'sequential-task-queue';
//
// export const sessionStorageTaskQueue = new SequentialTaskQueue();
let storageInstance: LocalForage;

export function getSessionState(key: string): any {
    let result: any = {};
    let stringValue: string | null = sessionStorage.getItem(key);
    if (stringValue) {
        try {
            result = JSON.parse(stringValue);
        } catch (e: any) {
            console.error(`Error reading session storage ${key}. ${e.message}`);
        }
    }
    return result;
}

export function setSessionState(key: string, val: any) {
    sessionStorage.setItem(key, JSON.stringify(val));
}

export function delSessionState(key: string) {
    sessionStorage.removeItem(key);
}

export function clearSessionState() {
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

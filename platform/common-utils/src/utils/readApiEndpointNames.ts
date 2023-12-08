import {readdirSync} from 'fs';
import path from 'path';

export function readApiEndpointNames(rootPath: string): Array<string> {
    try {
        const directoryNames: Array<string> = [];
        // Read all file and directory names in the root directory
        const entries = readdirSync(rootPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile()) {
                const fileName = path.parse(entry.name).name;
                directoryNames.push(fileName);
            }
        }
        return directoryNames;
    } catch (error) {
        console.error('Error reading directory: ', error);
        return [];
    }
}
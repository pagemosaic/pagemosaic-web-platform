export interface PostStreamController {
    abort: () => void;
}

export async function get<T>(
    url: string,
    token?: string,
    controllerCb?: (controller: PostStreamController) => void,
): Promise<T | undefined> {
    let response;
    const abortController = new AbortController();
    if (controllerCb){
        controllerCb({
            abort: () => {
                abortController.abort();
            }
        });
    }
    try {
        response = await fetch(encodeURI(url), {
            method: 'GET',
            headers: {
                xtoken: token ?? '',
            },
            signal: abortController.signal
        });
    } catch (e: any) {
        if (e.name === 'AbortError') {
            throw Error('Request was canceled.');
        }
        throw Error(`There is no connection to ${url}. The reason of failure... CORS`);
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw Error(`Resource ${url} is not found`);
        }
        const errorData = await response.text();
        throw Error(errorData);
    }
    const result = await response.json();
    return result as T;
}

export async function post<T>(
    url: string,
    body: any,
    token?: string,
    controllerCb?: (controller: PostStreamController) => void,
): Promise<T | undefined> {
    let response;
    const abortController = new AbortController();
    if (controllerCb){
        controllerCb({
            abort: () => {
                abortController.abort();
            }
        });
    }
    try {
        response = await fetch(encodeURI(url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                xtoken: token ?? '',
            },
            body: JSON.stringify(body),
            signal: abortController.signal
        });
        // throw new Error('Test');
    } catch (e: any) {
        if (e.name === 'AbortError') {
            throw Error('Request was canceled.');
        }
        throw Error(`There is no connection to ${url}. The reason of failure can be CORS.`);
    }
    if (!response.ok) {
        if (response.status === 404) {
            throw Error(`Resource ${url} is not found`);
        }
        const errorData = await response.text();
        throw Error(errorData);
    }
    const result = await response.json();
    return result as T;
}

export async function postStream(
    url: string,
    body: any,
    cb: (text: string) => void,
    done: (error?: string) => void,
    controllerCb: (controller: PostStreamController) => void,
    token?: string
): Promise<void> {
    const abortController = new AbortController();
    let response;
    try {
        response = await fetch(encodeURI(url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                xtoken: token ?? '',
            },
            body: JSON.stringify(body),
            signal: abortController.signal
        });
    } catch (e: any) {
        throw Error(`There is no connection to ${url}. The reason of failure can be CORS.`);
    }

    if (response && !response.ok) {
        if (response.status === 404) {
            throw Error(`Resource ${url} is not found`);
        }
        const errorData = await response.text();
        console.error(errorData);
        throw Error(errorData);
    }
    if (response && response.body) {
        controllerCb({
            abort: () => {
                abortController.abort();
            }
        });
        try {
            const reader = response.body.getReader();
            const textDecoder = new TextDecoder('utf-8');
            let result = '';
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                result += textDecoder.decode(value);
                cb(result);
            }
            done();
        } catch (e: any) {
            if (e.name === 'AbortError') {
                done();
            } else {
                done(e.message);
            }
        }
    } else {
        done('Missing body in the response');
    }
}

export async function del<T>(url: string, body: any, token?: string): Promise<T> {
    let response;
    try {
        response = await fetch(encodeURI(url), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                xtoken: token ?? '',
            },
            body: JSON.stringify(body),
        });
    } catch (e: any) {
        throw Error(`There is no connection to ${url}. The reason of failure... CORS?`);
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw Error(`Resource ${url} is not found`);
        }
        const errorData = await response.text();
        throw Error(errorData);
    }
    const result = await response.json();
    return result as T;
}

export async function putFile(url: string, file: File, token?: string) {
    let response;
    try {
        response = await fetch(encodeURI(url), {
            method: 'PUT',
            headers: {
                xtoken: token ?? '',
            },
            body: file,
        });
    } catch (e: any) {
        // console.log(e.message);
        throw Error(e.message);
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw Error(`Resource ${url} is not found`);
        }
        const errorData = await response.text();
        if (errorData && errorData.includes('EntityTooLarge')) {
            throw Error('The file is too large');
        }
        throw Error(errorData);
    }
}

export function putFile1(
    url: string,
    file: File,
    progressCB: (complete: number, cancel: () => void) => void
) {
    const xhr = new XMLHttpRequest();
    let isAborted = false;
    const cancel = () => {
        isAborted = true;
        xhr.abort();
    }
    return new Promise<void>((resolve, reject) => {
        xhr.open('PUT', encodeURI(url), true);
        // Listen to the upload progress.
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressCB(e.loaded, cancel);
            }
        };
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Upload completed successfully.');
                resolve();
            } else {
                if (xhr.status === 404) {
                    reject(new Error(`Resource ${url} is not found`));
                } else {
                    const errorData = xhr.responseText;
                    if (errorData && errorData.includes('EntityTooLarge')) {
                        reject(new Error('The file is too large'));
                    } else {
                        reject(new Error(errorData));
                    }
                }
            }
        };
        xhr.onerror = function() {
            if (!isAborted) {
                reject(new Error("Network error occurred"));
            }
        };
        xhr.ontimeout = function() {
            reject(new Error("The request timed out"));
        };
        xhr.onabort = function() {
            reject(new Error("The operation was aborted"));
        };
        xhr.send(file);
    });
}
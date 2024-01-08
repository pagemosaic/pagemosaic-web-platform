import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_RESET} from '@/utils/FormUtils';
import {userBucketDataSingleton} from '@/data/UserBucketData';

const addFolderSchema = z.object({
    directoryName: z.string().min(1, {
        message: 'The folder name should be not empty'
    }),
    currentPath: z.string().min(1, {
        message: 'The current path value is missing'
    }),
});

export async function filesFinderAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            let formData = await request.formData();
            const action = formData.get('action');
            if (action === 'addFolder') {
                const data = Object.fromEntries(formData);
                const formValidationResult = addFolderSchema.safeParse(data);
                if (!formValidationResult.success) {
                    const formatted = formValidationResult.error.format();
                    return json(formatted);
                }
                const {currentPath, directoryName} = data;
                try {
                    await userBucketDataSingleton.addFolder(`${currentPath}${directoryName}`);
                    return json({ok: true});
                } catch (e: any) {
                    return json({error: e.message});
                }
            } else if(action === 'deleteFiles') {
                const filePaths = formData.getAll('filePaths') as Array<string>;
                try {
                    await userBucketDataSingleton.deleteFiles(filePaths);
                    return json({ok: true});
                } catch (e: any) {
                    return json({error: e.message});
                }
            } else if (action === FORM_ACTION_RESET) {
                return redirect('/files');
            }
            return json({});
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

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
                console.log('Data: ', data);
                const formValidationResult = addFolderSchema.safeParse(data);
                if (!formValidationResult.success) {
                    const formatted = formValidationResult.error.format();
                    return json(formatted);
                }
                const {currentPath, directoryName} = data;
                await userBucketDataSingleton.addFolder(`${currentPath}/${directoryName}`);
                return json({ok: true});
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

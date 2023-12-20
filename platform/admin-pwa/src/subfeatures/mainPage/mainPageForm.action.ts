import {LoaderFunctionArgs, json} from 'react-router-dom';
import * as z from 'zod';
import {mainPageDataSingleton} from '@/data/MainPageData';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';

const formSchema = z.object({
    pageTitle: z.string().min(2, {
        message: "Page title must be at least 2 characters.",
    }),
    pageDescription: z.string().min(2, {
        message: "Page description must be at least 2 characters.",
    }),
    pageBody: z.string().min(2, {
        message: "Page body must be at least 2 characters.",
    }),
});

export async function mainPageFormAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            let formData = await request.formData();
            const action = formData.get('action');
            if (action === FORM_ACTION_SUBMIT) {
                const data = Object.fromEntries(formData);
                const validationResult = formSchema.safeParse(data);
                if (!validationResult.success) {
                    const formatted = validationResult.error.format();
                    return json(formatted);
                }
                try {
                    await mainPageDataSingleton.updatePageContent(data);
                } catch (e: any) {
                    return json({error: e.message});
                }
                return json({ok: true});
            } else if (action === FORM_ACTION_RESET) {
                return json({ok: true});
            }
            break;
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

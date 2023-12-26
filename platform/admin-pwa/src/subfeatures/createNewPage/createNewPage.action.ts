import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';

const formSchema = z.object({
    PK: z.string().min(2, {
        message: "Id must be at least 2 characters.",
    }),
    MetaTitle: z.string().min(2, {
        message: "Page title must be at least 2 characters.",
    }),
    MetaDescription: z.string().min(2, {
        message: "Page description must be at least 2 characters.",
    }),
    ContentScript: z.string().min(2, {
        message: "Page HTML must be at least 2 characters.",
    }),
    ContentStyles: z.string().min(2, {
        message: "Page styles must be at least 2 characters.",
    }),
});

export async function createNewPageAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            console.log('createNewPageAction');
            let formData = await request.formData();
            const action = formData.get('action');
            if (action === FORM_ACTION_SUBMIT) {
                const data = Object.fromEntries(formData);
                console.log('Form Data: ', JSON.stringify(data, null, 4));
                const validationResult = formSchema.safeParse(data);
                if (!validationResult.success) {
                    const formatted = validationResult.error.format();
                    return json(formatted);
                }
                try {
                    return redirect('/pages?entryType=page');
                } catch (e: any) {
                    return json({error: e.message});
                }
            } else if (action === FORM_ACTION_RESET) {
                return redirect('/new-page');
            }
            break;
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

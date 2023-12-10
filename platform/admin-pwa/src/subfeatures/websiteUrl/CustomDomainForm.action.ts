import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {websiteUrlDataSingleton} from '@/data/WebsiteUrlData';

const formSchema = z.object({
    customDomainName: z.string().min(2, {
        message: "Custom domain name must be at least 2 characters.",
    }),
});

export async function customDomainFormAction({request}: LoaderFunctionArgs) {
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
                    await websiteUrlDataSingleton.setCustomDomain(data);
                } catch (e: any) {
                    return json({error: e.message});
                }
                return redirect('/settings/website-url');
            }
            break;
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

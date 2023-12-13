import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {websiteDataSingleton} from '@/data/WebsiteUrlData';

const formSchema = z.object({
    domain: z.string().min(2, {
        message: "The domain must be at least 2 characters.",
    }),
});

export async function distributionDomainFormAction({request}: LoaderFunctionArgs) {
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
                    await websiteDataSingleton.setCustomDomainDistribution();
                    // await new Promise((res) => setTimeout(res, 1000));
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

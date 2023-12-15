import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {websiteDataSingleton} from '@/data/WebsiteUrlData';

const formSchema = z.object({
    sslCertificateArn: z.string().min(2, {
        message: "SSL certificate ARN must be at least 2 characters.",
    }),
    entryPointDomain: z.string().min(2, {
        message: "Entrypoint domain name must be at least 2 characters.",
    }),
});

export async function deleteDomainFormAction({request}: LoaderFunctionArgs) {
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
                    await websiteDataSingleton.deleteCustomDomain();
                    await new Promise((res) => setTimeout(res, 1000));
                    const {entryPointDomain} = data;
                    if (!request.url.includes(entryPointDomain.toString())){
                        window.location.href = `https://${entryPointDomain}/admin/settings/website-url`;
                    }
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

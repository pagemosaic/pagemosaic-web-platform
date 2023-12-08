import {LoaderFunctionArgs, json} from 'react-router-dom';
import {sysUserProfileDataSingleton} from '@/data/SysUserProfileData';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
});

export async function sysUserProfileAction({request}: LoaderFunctionArgs) {
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
                    await sysUserProfileDataSingleton.setData(data);
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
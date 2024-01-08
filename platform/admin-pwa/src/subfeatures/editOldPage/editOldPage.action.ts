import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';
import {getSessionState} from '@/utils/localStorage';
import {PageData, pageDataSingleton} from '@/data/PageData';

const ZPageEntry = z.object({
    MetaTitle: z.string().min(2, {
        message: "Page title must be at least 2 characters.",
    }),
    MetaDescription: z.string().min(2, {
        message: "Page description must be at least 2 characters.",
    }),
    MetaSlug: z.string().min(2, {
        message: "Page slug must be at least 2 characters.",
    }),
    ContentScript: z.string().min(2, {
        message: "Page HTML must be at least 2 characters.",
    }),
    ContentStyles: z.string().min(2, {
        message: "Page styles must be at least 2 characters.",
    })
});

const formSchema = z.object({
    sessionStateKey: z.string().min(1, {
        message: 'Missing session state key'
    })
});

export async function editOldPageAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            let formData = await request.formData();
            const action = formData.get('action');
            if (action === FORM_ACTION_SUBMIT) {
                const data = Object.fromEntries(formData);
                const formValidationResult = formSchema.safeParse(data);
                if (!formValidationResult.success) {
                    const formatted = formValidationResult.error.format();
                    return json(formatted);
                }

                const sessionStateKey = data['sessionStateKey'].toString();
                const editPageData: PageData | undefined = getSessionState<PageData>(sessionStateKey);
                if (!editPageData) {
                    return json({error: 'Missing the page data to save'});
                }
                try {
                    const pageEntryValidationResult = ZPageEntry.safeParse({
                        MetaTitle: editPageData.pageEntry.Meta?.MetaTitle.S,
                        MetaDescription: editPageData.pageEntry.Meta?.MetaDescription.S,
                        MetaSlug: editPageData.pageEntry.Meta?.MetaSlug.S,
                        ContentScript: editPageData.pageEntry.Content?.ContentScript.S,
                        ContentStyles: editPageData.pageEntry.Content?.ContentStyles.S
                    });
                    if (!pageEntryValidationResult.success) {
                        const formatted = pageEntryValidationResult.error.format();
                        return json(formatted);
                    }
                    await pageDataSingleton.savePage(editPageData);
                    return redirect('/pages?entryType=page');
                } catch (e: any) {
                    return json({error: e.message});
                }
            } else if (action === FORM_ACTION_RESET) {
                return redirect('/pages?entryType=page');
            }
            break;
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

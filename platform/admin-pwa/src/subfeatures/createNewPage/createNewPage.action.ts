import {LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import * as z from 'zod';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';
import {PageData, pageDataSingleton} from '@/data/PageData';
import {getSessionState} from '@/utils/localStorage';

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

export async function createNewPageAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            console.log('createNewPageAction');
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
                const newPageData: PageData | undefined = getSessionState<PageData>(sessionStateKey);
                if (!newPageData) {
                    return json({error: 'Missing the page data to save'});
                }
                try {
                    const pageEntryValidationResult = ZPageEntry.safeParse({
                        MetaTitle: newPageData.pageEntry.Meta?.MetaTitle.S,
                        MetaDescription: newPageData.pageEntry.Meta?.MetaDescription.S,
                        MetaSlug: newPageData.pageEntry.Meta?.MetaSlug.S,
                        ContentScript: newPageData.pageEntry.Content?.ContentScript.S,
                        ContentStyles: newPageData.pageEntry.Content?.ContentStyles.S
                    });
                    if (!pageEntryValidationResult.success) {
                        const formatted = pageEntryValidationResult.error.format();
                        return json(formatted);
                    }
                    await pageDataSingleton.savePage(newPageData);
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

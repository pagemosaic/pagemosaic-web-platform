import type {MetaFunction, LoaderFunctionArgs} from "@remix-run/node";
import {json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {getMainPageContent, MainPageContent} from '~/api/mainPage.server';
import {MarkdownText} from '~/components/MarkdownText';

interface LoaderResponse {
    mainPageContent?: MainPageContent;
    error?: string;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
    return [
        {title: data?.title || 'Undefined title'},
        {name: "description", content: "Welcome to the Page Mosaic Platform Landing home page"},
    ];
};

export const loader = async (args: LoaderFunctionArgs) => {
    // const {request} = args;
    // const url = new URL(request.url);
    const result: LoaderResponse = {
        mainPageContent: undefined,
        error: undefined
    }
    try {
        const mainPageContent = await getMainPageContent();
        return json(mainPageContent);
    } catch (e: any) {
        throw json(e.message, {status: 500});
    }
};

export default function Index() {
    const {title, heroTitle, body} = useLoaderData<typeof loader>();
    return (
        <section className="spacetext flex items-center main-hero">
            <div className="relative max-w-7xl mx-auto items-center gap-12 rounded-3xl p-8 lg:p-20 w-full flex flex-col">
                <div className="max-w-xl text-center mx-auto">
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-base font-bold text-white px-6 py-2 rounded-lg bg-white/10 uppercase">
                                Welcome
                            </span>
                        </span>
                        <p className="mt-8 text-5xl font-extrabold tracking-tight text-white">
                            {heroTitle}
                        </p>
                    </div>
                </div>
                <div className="max-w-xl mx-auto">
                    <div className="text-white px-6 py-4 rounded-lg bg-white/10 prose lg:prose-xl">
                        <article className="prose-invert lg:prose-invert lg:prose-xl">
                            <MarkdownText markdown={body} />
                        </article>
                    </div>
                </div>
            </div>
        </section>
);
}

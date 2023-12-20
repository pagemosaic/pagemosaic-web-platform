import type {MetaFunction, LoaderFunctionArgs, LinksFunction} from "@remix-run/node";
import {json} from '@remix-run/node';
import {Link, useLoaderData} from '@remix-run/react';
import sanitize from 'sanitize-html';
import Handlebars from 'handlebars';
import parse, {domToReact, HTMLReactParserOptions, DOMNode, Element} from 'html-react-parser';
import {getMainPageContent, MainPageContent} from '~/api/mainPage.server';
import React from 'react';

interface LoaderResponse {
    mainPageContent?: MainPageContent;
    error?: string;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
    return [
        {title: data?.pageTitle || 'Undefined title'},
        {name: "description", content: data?.pageDescription || 'Home Page'},
    ];
};

// export const links: LinksFunction = () => [
//     { rel: "stylesheet", href: styles },
// ];

const probeStyles = `
    body {
        background-color: var(--gray-1);
        padding: var(--size-3);
    }
    button.blue {
        color: var(--blue-6);
        background-color: var(--blue-0);
        border: 1px solid var(--blue-1);
        border-radius: var(--radius-conditional-2);
        padding: var(--size-1) var(--size-2);

        &:hover {
            background-color: var(--blue-1);
        }
    }
    .card {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: var(--size-2);
        padding: var(--size-3);
        border-radius: var(--radius-conditional-3);
        border: var(--border-size-1) solid var(--gray-4);
        box-shadow: var(--shadow-1);

        &:hover {
            box-shadow: var(--shadow-3);
        }
    }
    .input {
        padding: var(--size-1) var(--size-2);
        border-radius: var(--radius-conditional-2);
        border: var(--border-size-1) solid var(--gray-1);
    }
    img {
        width: 100px;
    }
    .link {
        color: var(--blue-4);
        &:hover {
            color: var(--blue-5);
        }
    }
`;

const probeBody = `
    <div>Probe Template</div>
    <div>{{name}}</div>
    <div class="card">
        <label htmlFor="email">Email</label>
        <div x-bind:class="! open ? 'hidden' : ''">
            <input class="input" data-action="sm1" type="email" name="email"/>
        </div>
        <div>
            <p data-error="email"></p>
        </div>
        <div>
            <button class="blue" data-action="sm1" type="submit">Sign Up</button>
        </div>
        <label htmlFor="password">Password</label>
        <div>
            <input class="input" data-action="sm2" type="password" name="password"/>
        </div>
        <div>
            <button class="blue" data-action="sm2" type="submit">Sign Up</button>
        </div>
        <a href="/test">
            <img  src="https://upload.wikimedia.org/wikipedia/commons/0/00/56_-_SNCF_TER_Alsace_510_at_Wissembourg%2C_August_6%2C_2010.jpg" />
        </a>
        <div>
            <a href="/" class="link">Home</a>
        </div>
    </div>
`;

export const loader = async (args: LoaderFunctionArgs) => {
    // const {request} = args;
    // const url = new URL(request.url);
    // const result: LoaderResponse = {
    //     mainPageContent: undefined,
    //     error: undefined
    // }
    try {
        const mainPageContent = await getMainPageContent();
        console.log('mainPageContent: ', mainPageContent);
        const pageBody = probeBody;
        const pageData = {};
        const pageStyles = probeStyles;
        const template = Handlebars.compile(pageBody);
        const body = sanitize(template(pageData), {
            allowedTags: sanitize.defaults.allowedTags.concat([ 'img', 'button', 'input', 'label' ]),
            allowedAttributes: {...sanitize.defaults.allowedAttributes, '*': [ 'href', 'align', 'alt', 'class', 'data-*', 'htmlFor', 'x-*' ]}
        });
        // const styles = sanitize(`<style>${pageStyles}</style>`);
        return json({
            body,
            styles: pageStyles,
            pageTitle: 'Test Home',
            pageDescription: ''
        });
    } catch (e: any) {
        throw json(e.message, {status: 500});
    }
};

export default function Index() {
    const {body, styles} = useLoaderData<typeof loader>();
    const options: HTMLReactParserOptions = {
        replace(node) {
            const {attribs, name} = node as Element;
            if (!attribs) {
                return;
            }
            const children = (node as Element).children as DOMNode[];
            if (name === 'a') {
                return (
                    <Link to={attribs.href} className={attribs.class}>{domToReact(children, options)}</Link>
                );
            }

            // if (attribs['data-link'] === 'main') {
            //     return <h1 style={{ fontSize: 42 }}>{domToReact(children, options)}</h1>;
            // }
            //
            // if (attribs.class === 'prettify') {
            //     return (
            //         <span style={{ color: 'hotpink' }}>
            //             {domToReact(children, options)}
            //         </span>
            //     );
            // }
        },
    };

    return (
        <React.Fragment>
            <style>{styles}</style>
            {parse(body, options)}
        </React.Fragment>
    );
}

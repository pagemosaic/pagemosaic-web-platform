import React from 'react';
import * as prod from 'react/jsx-runtime';
import {unified} from 'unified';
import markdown from 'remark-parse';
import breaks from 'remark-breaks';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import rehypeExternalLinks from 'rehype-external-links';

// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

interface MarkdownTextProps {
    markdown: string;
}

// Create a processor with rehype and the React compiler
const processor = unified()
    .use(markdown)
    .use(breaks)
    .use(remark2rehype)
    .use(rehypeExternalLinks, {target: '_blank', rel: ['nofollow']})
    .use(rehype2react, production);

export function MarkdownText(props: MarkdownTextProps) {
    if (props.markdown && props.markdown.length > 0) {
        try {
            const jsx = processor.processSync(props.markdown).result;
            return <>{jsx}</>
        } catch (e: any) {
            console.error(`Error parsing markdown text. ${e.message}`);
        }
    }
    return <span></span>;
}

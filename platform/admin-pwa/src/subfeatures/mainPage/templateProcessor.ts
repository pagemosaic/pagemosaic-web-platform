import Handlebars from 'handlebars';

interface TemplateProcessorProps {
    script: string;
    styles: string;
    data: any;
}

const htmlTemplate = (body: string, styles: string) => (`
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="https://unpkg.com/open-props"/>
        </head>
        <body>
            <style>
                ${styles}
            </style>
            ${body}
        </body>
`);

export function getHTML(props: TemplateProcessorProps): string {
    const {script, styles, data} = props;
    const template = Handlebars.compile(script);
    const compiled = template(data);

    return htmlTemplate(compiled, styles);
}

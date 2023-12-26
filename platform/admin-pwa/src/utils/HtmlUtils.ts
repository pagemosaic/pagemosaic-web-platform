import Handlebars from 'handlebars';
import {ContentData} from 'infra-common/data/ContentData';

interface TemplateProcessorProps {
    script: string;
    styles: string;
    header: string;
    data: ContentData;
}

const htmlTemplate = (header: string, styles: string, body: string) => (`
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            ${header}
            <style>${styles}</style>
        </head>
        <body>
            ${body}
        </body>
`);

export function getHTML(props: TemplateProcessorProps): string {
    const {script, styles, header, data} = props;
    const template = Handlebars.compile(script);
    const compiled = template(data);

    return htmlTemplate(header, styles, compiled);
}

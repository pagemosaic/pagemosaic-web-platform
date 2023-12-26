import React from 'react';
import {useSessionState} from '@/utils/localStorage';
import {NewPageData} from '@/data/NewPageData';
import IFrameExtended from '@/components/utils/IFrameExtended';
import {getHTML} from '@/utils/HtmlUtils';

interface PreviewPanelProps {
    sessionStateKey: string;
}

export function PreviewPanel(props: PreviewPanelProps) {
    const {sessionStateKey} = props;

    const {value: newPageData} = useSessionState<NewPageData>(sessionStateKey);

    let newHtml: string = '';

    if (newPageData) {
        const {Content} = newPageData.pagesEntry;
        if (Content) {
            const {ContentStyles, ContentScript, ContentHeader, ContentData} = Content;
            try {
                newHtml = getHTML({
                    header: ContentHeader.S,
                    script: ContentScript.S,
                    styles: ContentStyles.S,
                    data: JSON.parse(ContentData.S)
                });
            } catch (e: any) {
                newHtml = `<html><body><p style="color: red; padding: 2em">${e.message}</p></body></html>`;
                // console.error(e);
            }
        }
    }

    return (
        <IFrameExtended zoomOut={true} srcdoc={newHtml}/>
    );
}

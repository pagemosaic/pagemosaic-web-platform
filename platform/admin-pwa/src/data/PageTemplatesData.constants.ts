import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {DI_ENTRY_SLICE_KEY, DI_META_SLICE_KEY, DI_CONTENT_SLICE_KEY} from 'infra-common/constants';

const script = `<h1>This is a new page</h1>
`;

const header = `<link rel="stylesheet" href="https://unpkg.com/open-props"/>
<link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css"/>
`;

const styles = `body {
    height: 100hv;
}

.sample-panel {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
}
`;

const dataConfig = `[
    {
        "label": "Sample Block",
        "code": "sampleBlock",
        "isArray": false,
        "fields": [
            {
                "label": "Sample Title",
                "code": "sampleTitle",
                "type": "text",
                "isArray": false
            }
        ]
    }
]
`;

const data = `{
    "sampleBlock": {
        "sampleTitle": {
            "value": "Hello, this is a new page!"
        }
    }
}
`

export const defaultPageTemplateEntry: DI_PageEntry = {
    Entry: {
        PK: {S: `PAGE#__new__`},
        SK: {S: DI_ENTRY_SLICE_KEY},
        EntryType: {S: 'page_template'},
        EntryCreateDate: {N: Date.now().toString()},
        EntryUpdateDate: {N: Date.now().toString()}
    },
    Meta: {
        PK: {S: `PAGE#__new__`},
        SK: {S: DI_META_SLICE_KEY},
        MetaTitle: {S: 'New Page'},
        MetaDescription: {S: 'The new empty page'},
        MetaRoute: {S: ''},
        MetaSlug: {S: 'new-page'}
    },
    Content: {
        PK: {S: `PAGE#__new__`},
        SK: {S: DI_CONTENT_SLICE_KEY},
        ContentScript: {S: script},
        ContentHeader: {S: header},
        ContentStyles: {S: styles},
        ContentData: {S: data},
        ContentDataConfig: {S: dataConfig}
    }
};
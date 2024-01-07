import {nanoid} from 'nanoid';
import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {PageData} from '@/data/PageData';

export function initNewPageData(pageTemplateEntry: DI_PageEntry): PageData {
    const {Entry, Meta, Content, TagEntries, Tags} = pageTemplateEntry;
    if (Entry && Meta && Content) {
        const id = nanoid();
        return {
            pageEntry: {
                Entry: {
                    ...Entry,
                    PK: {S: `PAGE#${id}`},
                    EntryType: {S: 'page'},
                    EntryCreateDate: {N: Date.now().toString()},
                    EntryUpdateDate: {N: Date.now().toString()}
                },
                Meta: {
                    ...Meta,
                    PK: {S: `PAGE#${id}`},
                    MetaTitle: {S: 'New Page'},
                    MetaRoute: {S: ''},
                    MetaSlug: {S: 'new-page'}
                },
                Content: {
                    ...Content,
                    PK: {S: `PAGE#${id}`}
                }
            }
        };
    }
    throw Error('Incomplete page template structure');
}

import {Router, Request, Response} from 'express';
import {DI_TagEntry, DI_PageEntry, DI_EntrySlice} from 'infra-common/data/DocumentItem';
import {
    DI_ENTRY_SLICE_KEY,
    DI_TAG_ENTRY_TYPE,
    DI_MAIN_PAGE_ENTRY_TYPE,
    DI_CONTENT_SLICE_KEY,
    DI_REGULAR_PAGE_ENTRY_TYPE,
    PLATFORM_DOCUMENTS_TABLE_NAME, DI_DESCRIPTION_SLICE_KEY, DI_META_SLICE_KEY
} from 'infra-common/constants';
import {createOrUpdateItem} from 'infra-common/utils/database';
import {BasicItem} from 'infra-common/data/BasicItem';
import {getEntrySliceByEntryType} from 'infra-common/dao/documentDao';

const router = Router();

router.get('/get-test-1', async (req: Request, res: Response) => {

    const tags: Array<DI_TagEntry> = [
        {
            Entry: {
                PK: {S: 'TAG#1'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            },
            Description: {
                PK: {S: 'TAG#1'},
                SK: {S: DI_DESCRIPTION_SLICE_KEY},
                DescriptionLabel: {S: 'Red Tag'},
                DescriptionText: {S: 'Probe Tag with name: Red Tag'}
            }
        },
        {
            Entry: {
                PK: {S: 'TAG#2'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            },
            Description: {
                PK: {S: 'TAG#2'},
                SK: {S: DI_DESCRIPTION_SLICE_KEY},
                DescriptionLabel: {S: 'Blue Tag'},
                DescriptionText: {S: 'Probe Tag with name: Blue Tag'}
            }
        },
        {
            Entry: {
                PK: {S: 'TAG#3'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            },
            Description: {
                PK: {S: 'TAG#3'},
                SK: {S: DI_DESCRIPTION_SLICE_KEY},
                DescriptionLabel: {S: 'Green Tag'},
                DescriptionText: {S: 'Probe Tag with name: Blue Tag'}
            }
        }
    ];

    const homePage: DI_PageEntry = {
        Entry: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: DI_MAIN_PAGE_ENTRY_TYPE},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        Meta: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'Home Page | MyLanding'},
            MetaDescription: {S: 'This is home page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'home'},
        },
        Content: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        TagEntries: []
    };

    const firstPage: DI_PageEntry = {
        Entry: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: DI_REGULAR_PAGE_ENTRY_TYPE},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        Meta: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'The First Page | MyLanding'},
            MetaDescription: {S: 'This is the first page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'first'},
        },
        Content: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        Tags: [
            {
                PK: {S: 'PAGE#2'},
                SK: tags[0].Entry.PK,
                TagId: tags[0].Entry.PK
            },
            {
                PK: {S: 'PAGE#2'},
                SK: tags[1].Entry.PK,
                TagId: tags[1].Entry.PK
            },
            {
                PK: {S: 'PAGE#2'},
                SK: tags[2].Entry.PK,
                TagId: tags[2].Entry.PK
            }
        ],
        TagEntries: [tags[0], tags[1], tags[2]]
    };

    const secondPage: DI_PageEntry = {
        Entry: {
            PK: {S: 'PAGE#3'},
            SK: {S: 'ENTRY'},
            EntryType: {S: 'page'},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        Meta: {
            PK: {S: 'PAGE#3'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'The Second Page | MyLanding'},
            MetaDescription: {S: 'This is the second page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'second'},
        },
        Content: {
            PK: {S: 'PAGE#3'},
            SK: {S: 'CONTENT'},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        Tags: [
            {
                PK: {S: 'PAGE#3'},
                SK: tags[1].Entry.PK,
                TagId: tags[1].Entry.PK
            },
            {
                PK: {S: 'PAGE#3'},
                SK: tags[2].Entry.PK,
                TagId: tags[2].Entry.PK
            }
        ],
        TagEntries: [tags[1], tags[2]]
    };

    const firstTemplate: DI_PageEntry = {
        Entry: {
            PK: {S: 'PAGE_TEMPLATE#1'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: 'page_template'},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        Meta: {
            PK: {S: 'PAGE_TEMPLATE#1'},
            SK: {S: DI_META_SLICE_KEY},
            MetaTitle: {S: 'The Template Page 1 | MyLanding'},
            MetaDescription: {S: 'This is the template page #1 of my landing'},
            MetaRoute: {S: ''},
            MetaSlug: {S: ''},
        },
        Content: {
            PK: {S: 'PAGE_TEMPLATE#1'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        TagEntries: []
    };

    const secondTemplate: DI_PageEntry = {
        Entry: {
            PK: {S: 'PAGE_TEMPLATE#2'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: 'page_template'},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        Meta: {
            PK: {S: 'PAGE_TEMPLATE#2'},
            SK: {S: DI_META_SLICE_KEY},
            MetaTitle: {S: 'The Template Page 2 | MyLanding'},
            MetaDescription: {S: 'This is the template page #2 of my landing'},
            MetaRoute: {S: ''},
            MetaSlug: {S: ''},
        },
        Content: {
            PK: {S: 'PAGE_TEMPLATE#2'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        TagEntries: []
    };

    try {
        for (const tagItem of tags) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, tagItem.Entry);
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, tagItem.Description);
        }
        if (homePage.Entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, homePage.Entry);
        }
        if (homePage.Content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, homePage.Content);
        }
        if (homePage.Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, homePage.Meta);
        }
        if (homePage.Tags) {
            for (const pageTag of homePage.Tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        if (firstPage.Entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstPage.Entry);
        }
        if (firstPage.Content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstPage.Content);
        }
        if (firstPage.Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstPage.Meta);
        }
        if (firstPage.Tags) {
            for (const pageTag of firstPage.Tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        if (secondPage.Entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondPage.Entry);
        }
        if (secondPage.Content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondPage.Content);
        }
        if (secondPage.Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondPage.Meta);
        }
        if (secondPage.Tags) {
            for (const pageTag of secondPage.Tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        if (firstTemplate.Entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstTemplate.Entry);
        }
        if (firstTemplate.Content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstTemplate.Content);
        }
        if (firstTemplate.Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstTemplate.Meta);
        }
        if (secondTemplate.Entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondTemplate.Entry);
        }
        if (secondTemplate.Content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondTemplate.Content);
        }
        if (secondTemplate.Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondTemplate.Meta);
        }

        const entrySliceHomePages: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'main_page'});
        const entrySliceTemplates: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'page_template'});
        const entrySlicePages: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'page'});
        const entrySliceTags: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'tag'});

        res.status(200).json({
            name: 'OK',
            entrySliceHomePages,
            entrySliceTemplates,
            entrySlicePages,
            entrySliceTags
        });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;

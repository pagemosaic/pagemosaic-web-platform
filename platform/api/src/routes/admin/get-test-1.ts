import {Router, Request, Response} from 'express';
import {DI_TagEntry, DI_PageEntry, DI_EntrySlice} from 'infra-common/data/DocumentItem';
import {
    DI_ENTRY_SLICE_KEY,
    DI_TAG_ENTRY_TYPE,
    DI_MAIN_PAGE_ENTRY_TYPE,
    DI_CONTENT_SLICE_KEY,
    DI_REGULAR_PAGE_ENTRY_TYPE,
    PLATFORM_DOCUMENTS_TABLE_NAME
} from 'infra-common/constants';
import {createOrUpdateItem, getEntrySliceByEntryType} from 'infra-common/utils/database';
import {BasicItem} from 'infra-common/data/BasicItem';

const router = Router();

router.get('/get-test-1', async (req: Request, res: Response) => {

    const tags: Array<DI_TagEntry> = [
        {
            entry: {
                PK: {S: 'TAG#1'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            }
        },
        {
            entry: {
                PK: {S: 'TAG#2'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            }
        },
        {
            entry: {
                PK: {S: 'TAG#3'},
                SK: {S: DI_ENTRY_SLICE_KEY},
                EntryType: {S: DI_TAG_ENTRY_TYPE},
                EntryCreateDate: {N: Date.now().toString()},
                EntryUpdateDate: {N: Date.now().toString()},
            }
        }
    ];

    const homePage: DI_PageEntry = {
        entry: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: DI_MAIN_PAGE_ENTRY_TYPE},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        meta: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'Home Page | MyLanding'},
            MetaDescription: {S: 'This is home page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'home'},
        },
        content: {
            PK: {S: 'PAGE#1'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        tags: []
    };

    const firstPage: DI_PageEntry = {
        entry: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_ENTRY_SLICE_KEY},
            EntryType: {S: DI_REGULAR_PAGE_ENTRY_TYPE},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        meta: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'The First Page | MyLanding'},
            MetaDescription: {S: 'This is the first page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'first'},
        },
        content: {
            PK: {S: 'PAGE#2'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        tags: [
            {
                PK: {S: 'PAGE#2'},
                SK: tags[0].entry.PK,
                TagId: tags[0].entry.PK
            },
            {
                PK: {S: 'PAGE#2'},
                SK: tags[1].entry.PK,
                TagId: tags[1].entry.PK
            },
            {
                PK: {S: 'PAGE#2'},
                SK: tags[2].entry.PK,
                TagId: tags[2].entry.PK
            }
        ]
    };

    const secondPage: DI_PageEntry = {
        entry: {
            PK: {S: 'PAGE#3'},
            SK: {S: 'ENTRY'},
            EntryType: {S: 'page'},
            EntryCreateDate: {N: Date.now().toString()},
            EntryUpdateDate: {N: Date.now().toString()},
        },
        meta: {
            PK: {S: 'PAGE#3'},
            SK: {S: DI_CONTENT_SLICE_KEY},
            MetaTitle: {S: 'The Second Page | MyLanding'},
            MetaDescription: {S: 'This is the second page of my landing'},
            MetaRoute: {S: '/'},
            MetaSlug: {S: 'second'},
        },
        content: {
            PK: {S: 'PAGE#3'},
            SK: {S: 'CONTENT'},
            ContentScript: {S: '<html></html>'},
            ContentStyles: {S: ''},
            ContentData: {S: '{}'},
            ContentDataConfig: {S: '{}'}
        },
        tags: [
            {
                PK: {S: 'PAGE#3'},
                SK: tags[1].entry.PK,
                TagId: tags[1].entry.PK
            },
            {
                PK: {S: 'PAGE#3'},
                SK: tags[2].entry.PK,
                TagId: tags[2].entry.PK
            }
        ]
    };

    try {
        for (const tagItem of tags) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, tagItem.entry);
        }
        if (homePage.entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, homePage.entry);
        }
        if (homePage.content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, homePage.content);
        }
        if (homePage.tags) {
            for (const pageTag of homePage.tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        if (firstPage.entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstPage.entry);
        }
        if (firstPage.content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, firstPage.content);
        }
        if (firstPage.tags) {
            for (const pageTag of firstPage.tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        if (secondPage.entry) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondPage.entry);
        }
        if (secondPage.content) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, secondPage.content);
        }
        if (secondPage.tags) {
            for (const pageTag of secondPage.tags) {
                await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, pageTag);
            }
        }
        const entrySliceHomePage: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'main_page'});
        const entrySliceSome: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'some'});
        const entrySlicePage: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'page'});

        res.status(200).json({
            name: 'OK',
            entrySliceHomePage,
            entrySliceSome,
            entrySlicePage
        });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;

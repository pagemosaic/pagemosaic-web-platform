import {ItemKey} from './BasicItem';

// |--------|---------|-----------|
// | PK     | SK      | EntryType |
// |--------|---------|-----------|
// | PAGE#1 | ENTRY#1 | page      |
// |--------|---------|-----------|
// | TAG#1  | ENTRY#1 | tag       |
// |--------|---------|-----------|

// Tag -> PK: TAG#[TAG_ID], SK: ENTRY
// Page -> PK: PAGE#[PAGE_ID], SK: ENTRY
export type DI_EntrySlice = ItemKey & {
    EntryType: { S: string }; // main_page, page, tag
    EntryCreateDate: { N: string }; // when the entry was created
    EntryUpdateDate: { N: string }; // when the entry was updated
};

// Page -> PK: PAGE#[PAGE_ID], SK: TAG#[TAG_ID]
export type DI_TagSlice = ItemKey & {
    TagId: { S: string };
};

// Page -> PK: PAGE#[PAGE_ID], SK: META
export type DI_MetaSlice = ItemKey & {
    MetaDescription: { S: string }; // description text used as description in an HTML page
    MetaTitle: { S: string }; // any arbitrary text used as a title in an HTML page
    MetaRoute: { S: string }; // route path, used for grouping pages...
    MetaSlug: { S: string }; // slug of the page route: /{slug}
};

// Page -> PK: PAGE#[PAGE_ID], SK: CONTENT
export type DI_ContentSlice = ItemKey & {
    ContentScript: { S: string }; // html + handlebars
    ContentStyles: { S: string }; // CSS styles
    ContentHeader: { S: string }; // html head
    ContentDataConfig: { S: string }; // input fields config
    ContentData: { S: string };
};

// Tag -> PK: TAG#[TAG_ID], SK: DESCRIPTION
export type DI_DescriptionSlice = ItemKey & {
    DescriptionLabel: { S: string };
    DescriptionText: { S: string };
};

export type DI_TagEntry = {
    Entry: DI_EntrySlice; // PK: TAG#[TAG_ID], SK: ENTRY
    Description: DI_DescriptionSlice; // PK: TAG#[TAG_ID], SK: DESCRIPTION
};

export type DI_PageEntry = {
    Entry?: DI_EntrySlice; // PK: PAGE#[PAGE_ID], SK: ENTRY
    Meta?: DI_MetaSlice; // PK: PAGE#[PAGE_ID], SK: META
    Content?: DI_ContentSlice; // PK: PAGE#[PAGE_ID], SK: CONTENT
    Tags?: Array<DI_TagSlice>; // PK: PAGE#[PAGE_ID], SK: TAG#[TAG_ID]
    TagEntries?: Array<DI_TagEntry>;
};

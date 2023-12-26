export type ContentDataField = {
    value: string;
};

export type ContentDataBlock = Record<string, ContentDataField | Array<ContentDataField>>;

export type ContentData = Record<string, ContentDataBlock | Array<ContentDataBlock>>;

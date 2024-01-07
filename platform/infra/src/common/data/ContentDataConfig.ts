export const ContentDataFieldTypes = [
    'image',
    'text',
    'rich_text'
] as const;

export type ContentDataFieldClass = {
    label: string;
    code: string;
    type: typeof ContentDataFieldTypes[number];
    isArray?: boolean;
};

export type ContentDataBlockClass = {
    label: string;
    code: string;
    isArray?: boolean;
    fields: Array<ContentDataFieldClass>;
};

export type ContentDataConfigClass = Array<ContentDataBlockClass>;

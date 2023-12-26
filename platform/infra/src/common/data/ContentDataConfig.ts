export const ContentDataFieldTypes = [
    'image',
    'text'
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

const probe = [
    {
        "label": "Hero",
        "code": "hero",
        "fields": [
            {
                "label": "Hero Title",
                "code": "heroTitle",
                "type": "text"
            },
            {
                "label": "Hero Description",
                "code": "heroDescription",
                "type": "text"
            }
        ]
    }
];

export type ItemKey = {
    PK: {S: string};
    SK: {S: string};
};

export type BasicItem = ItemKey & Record<string, any>;

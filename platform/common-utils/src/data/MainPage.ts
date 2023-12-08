import {ItemKey} from './BasicItem';

export type MainPage = ItemKey & {
    Title: {S: string};
    HeroTitle: {S: string};
    Body: {S: string};
};

import {ItemKey} from './BasicItem';

export type MainPage = ItemKey & {
    PageTitle?: {S: string};
    PageDescription?: {S: string};
    PageBody?: {S: string};
    PageStyles?: {S: string};
    PageData?: any;
};

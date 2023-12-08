import {MainPage, PLATFORM_PAGES_TABLE_NAME} from 'common-utils';
import {getItemByKey} from '~/utils/DynamoDbUtils';

export interface MainPageContent {
    title: string;
    heroTitle: string;
    body: string;
}

export async function getMainPageContent(): Promise<MainPageContent> {
    const mainPageDbItem: MainPage | undefined = await getItemByKey(PLATFORM_PAGES_TABLE_NAME, {
        PK: {S: 'Page_main'},
        SK: {S: 'Content_main'}
    });
    if (mainPageDbItem) {
        return {
            title: mainPageDbItem.Title.S,
            heroTitle: mainPageDbItem.HeroTitle.S,
            body: mainPageDbItem.Body.S
        }
    }
    throw Error('Missing the Home page content');
}

import {MainPage} from 'infra-common/data/MainPage';
import {getItemByKey} from 'infra-common/aws/database';
import {PLATFORM_DOCUMENTS_TABLE_NAME} from 'infra-common/constants';

export interface MainPageContent {
    pageTitle: string;
    pageDescription: string;
    pageBody: string;
    pageStyles: string;
    pageData: any;
}

export async function getMainPageContent(): Promise<MainPageContent> {
    const mainPageDbItem: MainPage | undefined = await getItemByKey(PLATFORM_DOCUMENTS_TABLE_NAME, {
        PK: {S: 'Page_main'},
        SK: {S: 'Content_main'}
    });
    console.log('mainPageDbItem: ', mainPageDbItem);
    if (mainPageDbItem) {
        return {
            pageTitle: mainPageDbItem.PageTitle?.S || '',
            pageDescription: mainPageDbItem.PageDescription?.S || '',
            pageBody: mainPageDbItem.PageBody?.S || '',
            pageStyles: mainPageDbItem.PageStyles?.S || '',
            pageData: mainPageDbItem.PageData || {}
        }
    }
    throw Error('Missing the home page content');
}

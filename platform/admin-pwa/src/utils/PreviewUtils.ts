import {previewDataSingleton} from '@/data/PreviewData';

export async function openPreview(route?: string): Promise<void> {
    const previewData = await previewDataSingleton.getData();
    if (previewData?.domain) {
        window.open(`https://${previewData.domain}${route || '/'}`, 'PageMosaicAdminPreviewWindow');
    }
}

import {previewDataSingleton} from '@/data/PreviewData';

export async function openPreview(route?: string): Promise<void> {
    if (import.meta.env.MODE === 'production') {
        const previewData = await previewDataSingleton.getData();
        if (previewData?.domain) {
            window.open(`https://${previewData.domain}${route || '/'}`, 'PageMosaicAdminPreviewWindow');
        }
    } else {
        window.open(`http://localhost:3000${route || '/'}`, 'PageMosaicAdminPreviewWindow');
    }
}

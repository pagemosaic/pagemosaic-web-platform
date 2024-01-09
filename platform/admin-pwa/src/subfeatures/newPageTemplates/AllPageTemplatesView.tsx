import React from 'react';
import {PageTemplatesData} from '@/data/PageTemplatesData';
import {CardContent, Card} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {PageEntryThumbnail} from '@/components/utils/PageEntryThumbnail';
import {getIdFromPK} from 'infra-common/utility/database';

interface AllPageTemplatesViewProps {
    pageTemplatesData?: PageTemplatesData;
    isLoadingData?: boolean;
}

export function AllPageTemplatesView(props: AllPageTemplatesViewProps) {
    const {pageTemplatesData, isLoadingData} = props;
    if (isLoadingData) {
        return (
            <div className="p-4">
                <h1>Loading...</h1>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2 w-full h-full p-4">
            <div className="flex flex-col gap-2 mb-4">
                <p className="text-xl">Page Templates Gallery</p>
                <p className="text-sm text-muted-foreground">
                    Select a page template for your new stunning page.
                </p>
            </div>
            <div className="relative grow overflow-hidden">
                <Card className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pt-6">
                    <ScrollArea className="w-full h-full">
                        <CardContent>
                            <div className="grid grid-cols-[repeat(auto-fill,_200px)] gap-8">
                                {pageTemplatesData?.pageTemplateEntries.map((pageTemplateEntry) => {
                                    return (
                                        <PageEntryThumbnail
                                            key={pageTemplateEntry.Entry?.PK.S}
                                            pageEntry={pageTemplateEntry}
                                            className="w-[200px]"
                                            aspectRatio="square"
                                            width={200}
                                            height={200}
                                            useTemplateLink={`/new-page/${getIdFromPK(pageTemplateEntry.Entry?.PK.S)}`}
                                        />
                                    );
                                })}
                            </div>
                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}

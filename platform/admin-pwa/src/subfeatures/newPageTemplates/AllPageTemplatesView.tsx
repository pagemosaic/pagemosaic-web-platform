import React from 'react';
import {PageTemplatesData} from '@/data/PageTemplatesData';
import {CardContent, Card} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {PageEntryThumbnail} from '@/components/utils/PageEntryThumbnail';

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
            <div className="grow overflow-hidden">
                <ScrollArea className="w-full h-full pr-4">
                    <Card className="w-full pt-6">
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
                                            useTemplateLink="/new-page/345345"
                                        />
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </div>
    );
}

import {PagesData} from '@/data/PagesData';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Skeleton} from '@/components/ui/skeleton';
import React from 'react';
import {Table, TableBody, TableRow, TableCell} from '@/components/ui/table';
import {Card, CardContent} from '@/components/ui/card';
import {formatDistanceToNow} from 'date-fns';

interface AllPagesViewProps {
    pagesData?: PagesData;
    isLoadingData?: boolean;
}

export function AllPagesView(props: AllPagesViewProps) {
    const {pagesData, isLoadingData} = props;
    return (
        <ScrollArea className="w-full h-full p-4">
            <div className="relative flex flex-col gap-4">
                <div>
                    <p className="text-xl">List of Pages</p>
                </div>
                <Card className="w-full h-full pt-6">
                    <CardContent className="flex flex-col gap-4">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableBody>
                                    {isLoadingData && (
                                        <TableRow>
                                            <TableCell className="p-2">
                                                <Skeleton className="w-[150px] h-[2.5em]" />
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <Skeleton className="w-[150px] h-[2.5em]" />
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <Skeleton className="w-[150px] h-[2.5em]" />
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <Skeleton className="w-full h-[2.5em]" />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {pagesData?.pagesEntries.map((pageEntry) => {
                                        return (
                                            <TableRow key={pageEntry.Entry?.PK.S}>
                                                <TableCell className="font-medium p-2">
                                                    {pageEntry.Entry?.PK.S}
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    {pageEntry.Entry?.EntryType.S}
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    {formatDistanceToNow(Number(pageEntry.Entry?.EntryCreateDate.N))}
                                                </TableCell>
                                                <TableCell className="p-2 flex flex-row flex-wrap gap-2">
                                                    {pageEntry.TagEntries?.map((tagEntry) => {
                                                        return (
                                                            <div key={tagEntry.Entry.PK.S} className="p-1 bg-amber-200 rounded-2xl text-xs">
                                                                {tagEntry.Description.DescriptionLabel.S}
                                                            </div>
                                                        );
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}
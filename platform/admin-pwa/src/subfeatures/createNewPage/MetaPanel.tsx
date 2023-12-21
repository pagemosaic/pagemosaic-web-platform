import {DI_MetaSlice} from 'infra-common/data/DocumentItem';
import {Card, CardContent} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {ScrollArea} from '@/components/ui/scroll-area';
import React from 'react';

interface MetaPanelProps {
    Meta?: DI_MetaSlice;
    isInAction?: boolean;
    actionData: any;
}

export function MetaPanel(props: MetaPanelProps) {
    const {Meta, isInAction, actionData} = props;
    return (
        <Card className="w-full h-full pt-6">
            <CardContent className="h-full">
                <ScrollArea className="h-full w-full pr-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="MetaTitle">Page Title</Label>
                            <Input
                                name="MetaTitle"
                                type="text"
                                autoFocus={true}
                                disabled={isInAction}
                                defaultValue={Meta?.MetaTitle.S || ''}
                            />
                            <ActionDataFieldError actionData={actionData}
                                                  fieldName="MetaTitle"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="MetaDescription">Page Description</Label>
                            <Input
                                name="MetaDescription"
                                type="text"
                                disabled={isInAction}
                                defaultValue={Meta?.MetaDescription.S || ''}
                            />
                            <ActionDataFieldError actionData={actionData}
                                                  fieldName="MetaDescription"/>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

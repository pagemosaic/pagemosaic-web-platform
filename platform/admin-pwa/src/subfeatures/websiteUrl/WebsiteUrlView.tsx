import React from 'react';
import {Card, CardHeader, CardDescription, CardContent} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {Button} from '@/components/ui/button';
import {Link} from 'react-router-dom';
import {Separator} from '@/components/ui/separator';

interface WebsiteUrlViewProps {
    websiteUrlData?: WebsiteUrlData;
    isLoadingData?: boolean;
}

export function WebsiteUrlView(props: WebsiteUrlViewProps) {
    const {websiteUrlData, isLoadingData = false} = props;
    return (
        <div className="flex flex-col gap-2 w-full h-full p-4">
            <div className="flex flex-col gap-2 mb-4">
                <p className="text-xl">Website Address (URL) Settings</p>
                <p className="text-sm text-muted-foreground">eriuth dfjgdd gkjehgileru hdfkgjher gilrugh dfkjghe rgilreug hdjfdh rgiludh f</p>
            </div>
            <div className="grow overflow-hidden">
                <ScrollArea className="w-full h-full">
                <Card className="w-[500px] pt-6">
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="entryPointDomain">Public Website URL</Label>
                                <Input
                                    name="entryPointDomain"
                                    type="text"
                                    disabled={true}
                                    defaultValue={`https://${websiteUrlData?.entryPointDomain || ''}`}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="previewPointDomain">Preview Website URL</Label>
                                <Input
                                    name="previewPointDomain"
                                    type="text"
                                    disabled={true}
                                    defaultValue={`https://${websiteUrlData?.previewPointDomain || ''}`}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="customDomainName">Custom Domain</Label>
                                <div className="flex flex-row gap-1 items-center">
                                    <Input
                                        name="customDomainName"
                                        type="text"
                                        disabled={true}
                                        defaultValue={websiteUrlData?.customDomainName
                                            ? `https://${websiteUrlData?.customDomainName}`
                                            : ''
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        asChild={true}
                                    >
                                        <Link to="/settings/website-url/custom-domain">
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
            </div>
        </div>
    );
}
import React, {useState, useEffect} from 'react';
import {useFetcher} from "react-router-dom";
import {SysUserProfileData} from '@/data/SysUserProfileData';
import {Card, CardHeader, CardDescription, CardContent} from '@/components/ui/card';
import {LucidePencil, LucideRotateCw} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {FORM_ACTION_RESET, FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {DelayedLoading} from '@/components/utils/DelayedLoading';
import {ScrollArea} from '@/components/ui/scroll-area';

interface SysUserProfileFormProps {
    sysUserProfileData?: SysUserProfileData;
    isLoadingData?: boolean;
}

export function SysUserProfileForm(props: SysUserProfileFormProps) {
    const {sysUserProfileData, isLoadingData = false} = props;
    const fetcher = useFetcher();
    const [isEditing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.ok) {
            setEditing(false);
        }
    }, [fetcher.state, fetcher.data]);

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const handleStartEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setEditing(true);
    };

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="flex flex-col gap-2 w-full h-full p-4">
            <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
            <input name="pk" type="hidden" defaultValue={sysUserProfileData?.PK?.S || ''}/>
            <input name="sk" type="hidden" defaultValue={sysUserProfileData?.SK?.S || ''}/>
            <div className="flex flex-col gap-2 mb-4">
                <p className="text-xl">System User Profile Settings</p>
                <p className="text-sm text-muted-foreground">Here you can view and update the system user profile data</p>
            </div>
            <div className="flex flex-row gap-2">
                {isEditing
                    ? (
                        <>
                            <Button
                                type="reset"
                                size="sm"
                                variant="ghost"
                                disabled={isInAction}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                disabled={isInAction}
                            >
                                <DelayedLoading
                                    isLoading={isInAction}
                                    loadingElement={<span>Saving...</span>}
                                    element={<span>Save Changes</span>}
                                />
                            </Button>
                        </>
                    )
                    : (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isLoadingData}
                            onClick={handleStartEditing}
                        >
                            <DelayedLoading
                                isLoading={isLoadingData}
                                loadingElement={(
                                    <>
                                        <LucideRotateCw className="mr-2 h-3 w-3 animate-spin"/>
                                        Loading...
                                    </>
                                )}
                                element={(
                                    <>
                                        <LucidePencil className="mr-2 h-3 w-3"/>
                                        Edit
                                    </>
                                )}
                            />
                        </Button>
                    )
                }
            </div>
            <div className="grow overflow-hidden">
                <ScrollArea className="w-full h-full">
                    <Card className="w-[350px] pt-6">
                        <ActionDataRequestError actionData={fetcher.data} className="p-6 pt-0"/>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        name="email"
                                        type="text"
                                        autoFocus={true}
                                        disabled={!isEditing}
                                        defaultValue={sysUserProfileData?.UserEmail?.S || ''}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="email"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        name="fullName"
                                        type="text"
                                        disabled={!isEditing}
                                        defaultValue={sysUserProfileData?.UserFullName?.S || ''}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="fullName"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}
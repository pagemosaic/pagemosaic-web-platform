import React, {useState, useEffect} from 'react';
import {LucideFolderPlus, LucideCheck} from 'lucide-react';
import {TreeNode} from 'infra-common/system/Bucket';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useFetcher} from 'react-router-dom';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';

interface AddFolderButtonProps {
    node: TreeNode;
}

export function AddFolderButton(props: AddFolderButtonProps) {
    const {node} = props;
    const fetcher = useFetcher();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.ok) {
            setOpen(false);
        }
    }, [fetcher.state, fetcher.data]);

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <div className="flex flex-row gap-2 items-center">
                        <LucideFolderPlus className="w-4 h-4"/>
                        <span className="whitespace-nowrap">Add Folder</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <fetcher.Form method="post" className="flex flex-col gap-2">
                    <input type="hidden" name="currentPath" value={node.path} />
                    <DialogHeader>
                        <DialogTitle>New Folder</DialogTitle>
                        <DialogDescription>
                            A folder will be created in the current
                        </DialogDescription>
                        <ActionDataRequestError actionData={fetcher.data} />
                    </DialogHeader>
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Folder Name
                        </Label>
                        <Input
                            id="directoryName"
                            name="directoryName"
                            defaultValue=""
                        />
                        <ActionDataFieldError actionData={fetcher.data} fieldName="directoryName" />
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <ButtonAction
                            Icon={LucideCheck}
                            value="addFolder"
                            type="submit"
                            name="action"
                            label="Create"
                            variant="default"
                            isLoading={isInAction}
                        />
                    </DialogFooter>
                </fetcher.Form>
            </DialogContent>
        </Dialog>
    );
}

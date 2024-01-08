import React, {useState, useEffect} from 'react';
import {LucideTrash2} from 'lucide-react';
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
import {Button} from '@/components/ui/button';
import {useFetcher} from 'react-router-dom';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';

interface DeleteFilesButtonProps {
    filePaths: Array<string>;
}

export function DeleteFilesButton(props: DeleteFilesButtonProps) {
    const {filePaths} = props;
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
                <Button size="sm" variant="outline" disabled={filePaths.length === 0}>
                    <div className="flex flex-row gap-2 items-center">
                        <LucideTrash2 className="w-3 h-3"/>
                        <span className="whitespace-nowrap">Delete Selected</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <fetcher.Form method="post" className="flex flex-col gap-2">
                    {filePaths.map((filePath) => {
                        return (
                            <input key={filePath} type="hidden" name="filePaths" value={filePath}/>
                        );
                    })}
                    <DialogHeader>
                        <DialogTitle>Delete Selected {filePaths.length} Items</DialogTitle>
                        <DialogDescription>
                            All {filePaths.length} files will be deleted. This operation is not undoable.
                        </DialogDescription>
                        <ActionDataRequestError actionData={fetcher.data} />
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <ButtonAction
                            Icon={LucideTrash2}
                            value="deleteFiles"
                            type="submit"
                            name="action"
                            label="Delete"
                            variant="default"
                            isLoading={isInAction}
                        />
                    </DialogFooter>
                </fetcher.Form>
            </DialogContent>
        </Dialog>
    );
}

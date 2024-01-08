import React, {useState, useEffect, useRef} from 'react';
import {LucideCheck, LucideSearch} from 'lucide-react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {AsyncStatus} from '@/components/utils/AsyncStatusProvider';
import {userBucketDataSingleton, UserBucketData} from '@/data/UserBucketData';
import {FilesBrowser} from '@/subfeatures/pageContentEditing/FilesBrowser';

interface BrowseFilesButtonProps {
    disabled?: boolean;
    onSelect: (url: string) => void;
}

export function BrowseFilesButton(props: BrowseFilesButtonProps) {
    const {disabled = false, onSelect} = props;
    const [open, setOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<AsyncStatus>({isUninitialized: true});
    const userBucketDataRef = useRef<UserBucketData>(null);

    const handleOnSelect = (url: string) => {
        setOpen(false);
        onSelect(url);
    };

    useEffect(() => {
        setStatus({isLoading: true});
        userBucketDataSingleton.getPublicFiles()
            .then((userBucketData: UserBucketData) => {
                console.log('Finished getting data: ', userBucketData);
                userBucketDataRef.current = userBucketData;
                setStatus({isSuccess: true});
            })
            .catch((e: any) => {
                setStatus({isError: true, error: e.message});
            });
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={disabled}>
                    <div className="flex flex-row gap-2 items-center">
                        <LucideSearch className="w-4 h-4"/>
                        <span className="whitespace-nowrap">Browse Images</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Images</DialogTitle>
                    {status.isError && (
                        <div>
                            <p className="text-xs text-red-600">{status.error}</p>
                        </div>
                    )}
                </DialogHeader>
                <div>
                    {(status.isLoading || status.isUninitialized)
                        ? (<p>Loading...</p>)
                        : (<FilesBrowser userBucketData={userBucketDataRef.current} onSelect={handleOnSelect}/>)
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
}

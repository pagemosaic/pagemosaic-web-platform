import React from 'react';
import {LucideSearch} from 'lucide-react';
import imagePlaceholder from '@/assets/image-placeholder.svg';
import {Input} from '@/components/ui/input';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function ControlImage() {
    return (
        <div className="w-full flex flex-row gap-2 items-start justify-start">
            <div className="w-[150px] h-[150px] rounded-md border-[1px] border-slate-200 flex-grow-0 overflow-hidden">
                <img
                    src={imagePlaceholder}
                    alt={'Unknown'}
                    width={50}
                    height={50}
                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
            </div>
            <div className="flex flex-col gap-2 grow">
                <div className="w-full">
                    <Input className="w-full"  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <ButtonAction Icon={LucideSearch} label="Browse" size="sm" variant="secondary" />
                </div>
                <div>
                    <p className="text-sm font-normal text-muted-foreground">Some Text</p>
                </div>
            </div>
        </div>
    );
}
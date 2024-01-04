import React from 'react';
import {Button, ButtonProps} from '@/components/ui/button';
import {LucideIcon, LucideRefreshCw} from 'lucide-react';

type ButtonActionProps = ButtonProps & {
    label?: string;
    Icon: LucideIcon;
    isLoading?: boolean;
}

export function ButtonAction({label, Icon, isLoading, ...rest}: ButtonActionProps) {
    return (
        <Button
            {...rest}
            disabled={!!isLoading}
        >
            {isLoading
                ? (
                    <div className="flex flex-row gap-2 items-center">
                        <LucideRefreshCw className="w-3 h-3 animate-spin"/>
                        {label && (<span className="whitespace-nowrap">{label}</span>)}
                    </div>
                )
                : (
                    <div className="flex flex-row gap-2 items-center">
                        <Icon className="w-3 h-3"/>
                        {label && (<span className="whitespace-nowrap">{label}</span>)}
                    </div>
                )
            }
        </Button>
    );
}

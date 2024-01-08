import React from 'react';
import {Link} from "react-router-dom";
import {Button, ButtonProps} from '@/components/ui/button';
import {LucideIcon, LucideRefreshCw} from 'lucide-react';

type ButtonLinkProps = ButtonProps & {
    to: string;
    label: string;
    Icon: LucideIcon;
    isLoading?: boolean;
}

export function ButtonLink({to, label, Icon, isLoading, ...rest}: ButtonLinkProps) {
    return (
        <Button
            {...rest}
            disabled={!!isLoading}
            asChild={!isLoading}
        >
            {isLoading
                ? (
                    <div className="flex flex-row gap-2 items-center">
                        <LucideRefreshCw className="w-4 h-4 animate-spin"/>
                        <span className="whitespace-nowrap">{label}</span>
                    </div>
                )
                : (
                    <Link to={to}>
                        <div className="flex flex-row gap-2 items-center">
                            <Icon className="w-4 h-4"/>
                            <span className="whitespace-nowrap">{label}</span>
                        </div>
                    </Link>
                )
            }
        </Button>
    );
}

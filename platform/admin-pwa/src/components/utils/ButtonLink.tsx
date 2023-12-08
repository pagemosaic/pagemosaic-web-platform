import React from 'react';
import {useMatch, useResolvedPath, Link} from "react-router-dom";
import {Button} from '@/components/ui/button';
import {cn} from '@/utils/ComponentsUtils';

interface ButtonLinkProps {
    to: string;
    end?: boolean;
    className?: string;
    label: string;
    icon?: React.ReactNode;
}

export function ButtonLink({to, end = false, label, icon, className}: ButtonLinkProps) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end });
    return (
        <Button
            variant={match ? 'secondary' : 'ghost'}
            size="sm"
            className={className}
            asChild={true}
        >
            <Link to={to}>
                {icon}
                <span className={cn('whitespace-nowrap', {'ml-2': !!icon})}>{label}</span>
            </Link>
        </Button>
    );
}

import React from 'react';
import {useMatch, Link} from "react-router-dom";
import {Button, ButtonProps} from '@/components/ui/button';
import {cn} from '@/utils/ComponentsUtils';

type NavigationButtonLinkProps = ButtonProps & {
    pathKey: string;
    to: string;
    end?: boolean;
    label: string;
    icon?: React.ReactNode;
}

export function NavigationButtonLink({pathKey, to, end = false, label, icon, ...rest}: NavigationButtonLinkProps) {
    let match = useMatch({ path: pathKey, end });
    return (
        <Button
            {...rest}
            variant={match ? 'secondary' : 'ghost'}
            asChild={true}
        >
            <Link to={to}>
                {icon}
                <span className={cn('whitespace-nowrap', {'ml-2': !!icon})}>{label}</span>
            </Link>
        </Button>
    );
}

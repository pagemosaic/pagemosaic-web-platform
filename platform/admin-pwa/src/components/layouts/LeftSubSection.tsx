import React from 'react';

export function LeftSubSection({children}: {children: React.ReactNode}) {
    return (
        <div className="absolute top-0 left-[6em] w-[10em] bottom-0 overflow-hidden pt-8 pb-4 pr-2">
            {children}
        </div>
    );
}
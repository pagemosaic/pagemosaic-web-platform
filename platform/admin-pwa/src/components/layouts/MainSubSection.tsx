import React from 'react';

export function MainSubSection({children}: {children: React.ReactNode}) {
    return (
        <div className="absolute top-0 left-[6em] bottom-0 right-[6em]">
            {children}
        </div>
    );
}

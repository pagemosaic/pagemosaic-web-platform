import React from 'react';

export function CentralSubSection({children}: {children: React.ReactNode}) {
    return (
        <div className="absolute top-0 left-[16em] bottom-0 right-[6em]">
            {children}
        </div>
    );
}

import {Outlet} from 'react-router-dom';
import React from 'react';
import {MainSubSection} from '@/components/layouts/MainSubSection';

export function FilesRoute() {
    return (
        <MainSubSection>
            <Outlet/>
        </MainSubSection>
    );
}
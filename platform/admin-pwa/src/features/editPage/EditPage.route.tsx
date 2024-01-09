import {Outlet} from 'react-router-dom';
import React from 'react';
import {MainSubSection} from '@/components/layouts/MainSubSection';

export function EditPageRoute() {
    return (
        <MainSubSection>
            <Outlet/>
        </MainSubSection>
    );
}
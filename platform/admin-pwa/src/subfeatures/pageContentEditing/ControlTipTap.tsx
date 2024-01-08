import {TipTapEditor} from '@/components/utils/TipTapEditor';
import {ContentData} from 'infra-common/data/ContentData';
import React, {useMemo} from 'react';
import {debounce, set, get} from 'lodash-es';

interface ControlTipTapProps {
    controlKey: number;
    contentData: ContentData;
    fieldPath: string;
    disabled?: boolean;
    onChange: (newContentData: ContentData) => void;
}

export function ControlTipTap(props: ControlTipTapProps) {
    const {controlKey, contentData, fieldPath, disabled, onChange} = props;

    return useMemo(() => {
        const fieldPathValue = `${fieldPath}.value`;
        const debouncedOnChange = debounce((path: string, value: string) => {
            if (contentData) {
                const newContentData = set(contentData, path, value);
                onChange(newContentData);
            }
        }, 800);

        const handleOnChange = (html: string) => {
            debouncedOnChange(fieldPathValue, html);
        };

        let defaultHtmlValue = get(
            contentData,
            fieldPathValue,
            undefined
        ) as string | undefined;

        return (
            <div className="w-full">
                <TipTapEditor
                    controlKey={controlKey}
                    content={defaultHtmlValue || ''}
                    onChange={handleOnChange}
                />
            </div>
        );
    }, [controlKey]);
}
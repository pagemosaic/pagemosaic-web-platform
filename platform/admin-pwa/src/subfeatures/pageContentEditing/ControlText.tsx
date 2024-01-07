import React, {useMemo} from 'react';
import {debounce, set, get} from 'lodash-es';
import {ContentData} from 'infra-common/data/ContentData';
import {Input} from '@/components/ui/input';

interface ControlTextProps {
    controlKey: number;
    contentData: ContentData;
    fieldPath: string;
    disabled?: boolean;
    onChange: (newContentData: ContentData) => void;
}

export function ControlText(props: ControlTextProps) {
    const {controlKey, contentData, fieldPath, disabled = false, onChange} = props;

    return useMemo(() => {
        const fieldPathValue = `${fieldPath}.value`;
        const debouncedOnContentDataTextChange = debounce((path: string, value: string) => {
            if (contentData) {
                const newContentData = set(contentData, path, value);
                onChange(newContentData);
            }
        }, 800);

        const handleContentDataTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            debouncedOnContentDataTextChange(fieldPathValue, e.currentTarget.value);
        };

        let defaultTextValue = get(
            contentData,
            fieldPathValue,
            undefined
        ) as string | undefined;

        return (
            <Input
                key={controlKey}
                name={fieldPath}
                type="text"
                disabled={disabled}
                defaultValue={defaultTextValue}
                onChange={handleContentDataTextChange}
            />
        );
    }, [controlKey]);
}

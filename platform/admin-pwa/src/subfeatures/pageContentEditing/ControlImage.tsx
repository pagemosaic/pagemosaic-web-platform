import React, {useMemo} from 'react';
import imagePlaceholder from '@/assets/image-placeholder.svg';
import {Input} from '@/components/ui/input';
import {BrowseFilesButton} from '@/subfeatures/pageContentEditing/BrowseFilesButton';
import {ContentData} from 'infra-common/data/ContentData';
import {debounce, set, get} from 'lodash-es';

interface ControlImageProps {
    controlKey: number;
    contentData: ContentData;
    fieldPath: string;
    disabled?: boolean;
    onChange: (newContentData: ContentData, doRefresh?: boolean) => void;
}

export function ControlImage(props: ControlImageProps) {
    const {controlKey, contentData, fieldPath, disabled, onChange} = props;
    return useMemo(() => {
        const fieldPathValue = `${fieldPath}.value`;
        const debouncedOnTextChange = debounce((path: string, value: string) => {
            if (contentData) {
                const newContentData = set(contentData, path, value);
                onChange(newContentData);
            }
        }, 800);

        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            debouncedOnTextChange(fieldPathValue, e.currentTarget.value);
        };

        const handleImageSelect = (url: string) => {
            if (contentData) {
                const newContentData = set(contentData, fieldPathValue, url);
                onChange(newContentData, true);
            }
        };

        let defaultTextValue = get(
            contentData,
            fieldPathValue,
            undefined
        ) as string | undefined;

        return (
            <div className="w-full flex flex-row gap-2 items-start justify-start">
                <div className="w-[150px] h-[150px] rounded-md border-[1px] border-slate-200 flex-grow-0 overflow-hidden">
                    <img
                        src={defaultTextValue || imagePlaceholder}
                        alt={'Unknown'}
                        className="h-auto w-auto object-cover aspect-square"
                    />
                </div>
                <div className="flex flex-col gap-2 grow">
                    <div className="w-full">
                        <Input
                            key={controlKey}
                            name={fieldPath}
                            type="text"
                            disabled={disabled}
                            defaultValue={defaultTextValue}
                            onChange={handleTextChange}
                        />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <BrowseFilesButton
                            disabled={disabled}
                            onSelect={handleImageSelect}
                        />
                    </div>
                </div>
            </div>
        );
    }, [controlKey]);
}
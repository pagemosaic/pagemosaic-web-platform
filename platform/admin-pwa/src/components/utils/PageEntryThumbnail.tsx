import React from 'react';
import {LucidePlusCircle} from 'lucide-react';
import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {cn} from '@/utils/ComponentsUtils';
import imagePlaceholder from '@/assets/image-placeholder.svg';
import {ButtonLink} from '@/components/utils/ButtonLink';

interface PageEntryThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
    pageEntry: DI_PageEntry;
    aspectRatio?: "portrait" | "square";
    width?: number;
    height?: number;
    useTemplateLink: string;
}

export function PageEntryThumbnail(props: PageEntryThumbnailProps) {
    const {
        pageEntry,
        aspectRatio = "portrait",
        width,
        height,
        useTemplateLink,
        className,
        ...rest
    } = props;
    return (
        <div className={cn("flex flex-col gap-3 h-full", className)} {...rest}>
            <div className="flex-grow-0 overflow-hidden rounded-md">
                <img
                    src={imagePlaceholder}
                    alt={pageEntry.Meta?.MetaTitle.S || 'Unknown'}
                    width={width}
                    height={height}
                    className={cn(
                        "h-auto w-auto object-cover transition-all hover:scale-105",
                        aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                    )}
                />
            </div>
            <div className="flex-grow space-y-1 text-sm">
                <h3 className="font-medium leading-none line-clamp-1">
                    {pageEntry.Meta?.MetaTitle.S || 'Unknown Title'}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {pageEntry.Meta?.MetaDescription.S || 'Unknown Description'}
                </p>
            </div>
            <div className="flex-grow-0">
                <ButtonLink
                    label="Use Template"
                    to={useTemplateLink}
                    Icon={LucidePlusCircle}
                    size="sm"
                    variant="outline"
                />
            </div>
        </div>
    )
}

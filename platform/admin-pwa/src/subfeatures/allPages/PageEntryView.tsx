import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {formatDistanceToNow} from 'date-fns';

interface PageEntryViewProps {
    pageEntry: DI_PageEntry;
}

export function PageEntryView(props: PageEntryViewProps) {
    const {pageEntry: {TagEntries, Meta, Entry}} = props;
    return (
        <>
            <div className="p-4">
                {Entry?.EntryType.S}
            </div>
            <div className="p-4">
                {formatDistanceToNow(Number(Entry?.EntryCreateDate.N))}
            </div>
            <div className="p-4 flex flex-row flex-wrap gap-2">
                {TagEntries?.map((tagEntry) => {
                    return (
                        <div key={tagEntry.Entry.PK.S} className="p-1 bg-amber-200 rounded-2xl text-xs">
                            {tagEntry.Description.DescriptionLabel.S}
                        </div>
                    );
                })}
            </div>
            <div className="p-4">

            </div>
        </>
    );
}
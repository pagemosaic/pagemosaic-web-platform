import {ScrollArea} from '@/components/ui/scroll-area';
import {ButtonLink} from '@/components/utils/ButtonLink';
import {LucideUserCircle, LucideSettings, LucideBookOpen} from 'lucide-react';

export function MainNavigation() {
    return (
        <ScrollArea className="w-full h-full p-4">
            <div className="w-full flex flex-col gap-2">
                <div>
                    <ButtonLink
                        to="/pages/main-page"
                        end={false}
                        label="Pages"
                        className="w-full justify-start"
                        icon={<LucideBookOpen className="h-3 w-3"/>}
                    />
                </div>
                <div>
                    <ButtonLink
                        to="/settings/sys-user-profile"
                        end={false}
                        label="Settings"
                        className="w-full justify-start"
                        icon={<LucideSettings className="h-3 w-3"/>}
                    />
                </div>
            </div>
        </ScrollArea>
    );
}
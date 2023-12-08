import {ToolbarSection} from '@/components/layouts/ToolbarSection';
import {CentralSection} from '@/components/layouts/CentralSection';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Link} from 'react-router-dom';

export function WelcomeRoute() {
    return (
        <>
            <ToolbarSection>
                <div className="flex flex-row justify-between">
                </div>
            </ToolbarSection>
            <CentralSection>
                <ScrollArea className="w-full h-full p-4">
                    <div className="w-full flex flex-col gap-4">
                        <div>
                            <h2 className="text-xl">Welcome</h2>
                        </div>
                        <div>
                            <p className="text-sm">The platform has two features so far:</p>
                        </div>
                        <div>
                            <ul className="ml-4 list-disc">
                                <li>
                                    <Link className="text-blue-700 text-sm hover:underline" to="/pages/main-page">Home Page Content</Link>
                                </li>
                                <li>
                                    <Link className="text-blue-700 text-sm hover:underline" to="/settings/sys-user-profile">System User Profile</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ScrollArea>
            </CentralSection>
        </>
    );
}
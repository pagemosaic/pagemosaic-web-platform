import {UserBucketData} from '@/data/UserBucketData';
import React, {useMemo, useState} from 'react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    LucideHome,
    LucideFolder,
    LucideChevronRight,
    LucideFolderMinus,
    LucideFiles
} from 'lucide-react';
import {findNodeByPath, getParentNodes, nodesComparatorByName} from '@/utils/FileObjectUtils';
import {TreeNode} from 'infra-common/system/Bucket';
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@/components/ui/table';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card} from '@/components/ui/card';
import {ButtonLink} from '@/components/utils/ButtonLink';
import {humanReadableBytes, getTimeDistance} from '@/utils/FormatUtils';
import {useSessionState} from '@/utils/localStorage';

interface FilesBrowserProps {
    userBucketData: UserBucketData;
    onSelect: (url: string) => void;
}

export function FilesBrowser(props: FilesBrowserProps) {
    const {userBucketData, onSelect} = props;
    const {value: currentPath = 'public/', saveValue} = useSessionState<string>('fileBrowserCurrentPath');

    const currentNode: TreeNode = useMemo(() => {
        let result: TreeNode = {isRoot: true, path: 'public/', name: 'public', children: []};
        if (userBucketData?.publicFilesRoots) {
            let foundCurrentDirNodeInNewTree: TreeNode | undefined = undefined;
            for (const rootTreeNode of userBucketData?.publicFilesRoots) {
                foundCurrentDirNodeInNewTree = findNodeByPath(rootTreeNode, currentPath);
                if (foundCurrentDirNodeInNewTree) {
                    result = foundCurrentDirNodeInNewTree;
                }
            }
        }
        return result;
    }, [userBucketData?.publicFilesRoots, currentPath]);

    let folderPath: Array<TreeNode> = currentNode ? getParentNodes(currentNode) : [];
    if (folderPath.length > 3) {
        folderPath = folderPath.slice(-3);
    }

    const handleChangeCurrentPath = (newPath: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        saveValue(newPath);
    };

    const handleSelectItem = (url: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect(url);
    };

    let sortedContent = currentNode.children.sort(nodesComparatorByName('asc'));

    return (
        <div className="w-full h-[450px] flex flex-col gap-2">
            {sortedContent.length > 0 && (
                <div className="flex flex-row gap-2 items-center flex-nowrap">
                    {folderPath.map((folder) => {
                        return (
                            <React.Fragment key={folder.path}>
                                <div>
                                    {folder.name === 'public'
                                        ? (
                                            <ButtonAction
                                                Icon={LucideHome}
                                                variant="ghost"
                                                onClick={handleChangeCurrentPath(folder.path)}
                                                size="sm"
                                            />
                                        )
                                        : (
                                            <ButtonAction
                                                Icon={LucideFolder}
                                                label={folder.name}
                                                onClick={handleChangeCurrentPath(folder.path)}
                                                variant="ghost"
                                                size="sm"
                                            />
                                        )
                                    }
                                </div>
                                <div>
                                    <LucideChevronRight className="w-4 h-4"/>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div>
                        {currentNode.name === 'public'
                            ? (
                                <ButtonAction
                                    Icon={LucideHome}
                                    variant="ghost"
                                    disabled={true}
                                    size="sm"
                                />
                            )
                            : (
                                <ButtonAction
                                    Icon={LucideFolder}
                                    label={currentNode.name}
                                    variant="ghost"
                                    disabled={true}
                                    size="sm"
                                />
                            )
                        }
                    </div>
                    <div>
                        <ButtonLink
                            to="/files"
                            label="Manage Files"
                            size="sm"
                            variant="outline"
                            Icon={LucideFiles}
                        />
                    </div>
                </div>
            )}
            <div className="relative grow">
                {sortedContent.length > 0
                    ? (
                        <Card className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden">
                            <ScrollArea className="w-full h-full">
                                <Table>
                                    <TableBody>
                                        {sortedContent.map((treeNode, itemIndex) => {
                                            return (
                                                <TableRow key={treeNode.path}>
                                                    <TableCell className="flex flex-row items-center gap-2 flex-nowrap">
                                                        {treeNode.fileObject
                                                            ? (
                                                                <div className="w-[150px] h-[150px] rounded-md border-[1px] border-slate-200 overflow-hidden">
                                                                    <img
                                                                        src={treeNode.fileObject.url}
                                                                        alt={treeNode.name}
                                                                        className="h-auto w-auto object-cover aspect-square cursor-pointer"
                                                                        onClick={handleSelectItem(treeNode.fileObject.url)}
                                                                    />
                                                                </div>
                                                            )
                                                            : (
                                                                <>
                                                                    {treeNode.children.length > 0
                                                                        ? (<LucideFolder className="w-4 h-4"/>)
                                                                        : (<LucideFolderMinus className="w-4 h-4"/>)
                                                                    }
                                                                    <a
                                                                        href="#"
                                                                        onClick={handleChangeCurrentPath(treeNode.path)}
                                                                        className="hover:underline text-blue-600"
                                                                    >
                                                                        {treeNode.name}
                                                                    </a>
                                                                </>
                                                            )
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {(treeNode.fileObject && treeNode.fileObject.size) && (
                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-sm">{treeNode.name}</p>
                                                                <p className="text-sm">{treeNode.fileObject.url}</p>
                                                                <p className="text-sm">{getTimeDistance(treeNode.fileObject.timestamp)}</p>
                                                                <p className="text-sm">{humanReadableBytes(treeNode.fileObject.size)}</p>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </Card>
                    )
                    : (
                        <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                            <div>
                                <span className="text-muted-foreground text-sm">There is no images.</span>
                            </div>
                            <div>
                                <ButtonLink to="/files" label="Upload files here" Icon={LucideFiles} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

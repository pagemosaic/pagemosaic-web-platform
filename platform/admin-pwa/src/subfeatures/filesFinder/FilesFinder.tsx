import {UserBucketData} from '@/data/UserBucketData';
import React, {useMemo, useState} from 'react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    LucideHome,
    LucideFolder,
    LucideChevronRight,
    LucideSortAsc,
    LucideIcon,
    LucideFileImage,
    LucideFileVideo,
    LucideFileText,
    LucideFile,
    LucideFileArchive,
    LucideFolderMinus
} from 'lucide-react';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {useFetcher} from 'react-router-dom';
import {UploadButton} from '@/subfeatures/filesFinder/UploadButton';
import {findNodeByPath, getParentNodes, nodesComparatorByName} from '@/utils/FileObjectUtils';
import {TreeNode} from 'infra-common/system/Bucket';
import {AsyncStatusError} from '@/components/utils/AsyncStatusError';
import {AddFolderButton} from '@/subfeatures/filesFinder/AddFolderButton';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, TableFooter,
} from '@/components/ui/table';
import {Card} from '@/components/ui/card';
import {humanReadableBytes, getTimeDistance} from '@/utils/FormatUtils';
import {Checkbox} from '@/components/ui/checkbox';
import {ScrollArea} from '@/components/ui/scroll-area';
import {DeleteFilesButton} from '@/subfeatures/filesFinder/DeleteFilesButton';

interface FilesFinderProps {
    userBucketData: UserBucketData;
}

const fileTypesMap: Record<string, LucideIcon> = {
    'png': LucideFileImage,
    'jpg': LucideFileImage,
    'jpeg': LucideFileImage,
    'gif': LucideFileImage,
    'mov': LucideFileVideo,
    'avi': LucideFileVideo,
    'pdf': LucideFileText,
    'zip': LucideFileArchive,
};

function FileIcon({fileName}: { fileName: string }) {
    const fileExt = fileName.split('.').pop();
    let FoundIcon: LucideIcon = fileExt
        ? fileTypesMap[fileExt] || LucideFile
        : LucideFile;
    return <FoundIcon className="w-3 h-3"/>
}

export function FilesFinder(props: FilesFinderProps) {
    const {userBucketData} = props;
    const fetcher = useFetcher();
    const [currentPath, setCurrentPath] = useState<string>('public/');
    const [selected, setSelected] = useState<Record<string, boolean>>({});

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
        setCurrentPath(newPath);
        setSelected({});
    };

    const handleSelectItem = (itemPath: string) => (checked: boolean) => {
        setSelected(prevSelected => {
            let newSelected = {...prevSelected};
            if (checked) {
                newSelected[itemPath] = true;
            } else {
                delete newSelected[itemPath];
            }
            console.log('newSelected: ', newSelected[itemPath]);
            return newSelected;
        });
    };

    let totalSize = 0;
    let sortedContent = currentNode.children.sort(nodesComparatorByName('asc'));

    return (
        <div className="w-full h-full p-4 flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
                <div>
                    <p className="text-xl">Files</p>
                </div>
                <ActionDataRequestError actionData={fetcher.data}/>
                <AsyncStatusError/>
            </div>
            <div className="flex flex-row gap-2 items-center flex-nowrap justify-between">
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
                                    <LucideChevronRight className="w-3 h-3"/>
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
                        <AddFolderButton node={currentNode}/>
                    </div>
                    <div>
                        <UploadButton node={currentNode}/>
                    </div>
                </div>
                <div>
                    <DeleteFilesButton filePaths={Object.keys(selected)}/>
                </div>
            </div>
            <div className="relative grow">
                <Card className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden">
                    <ScrollArea className="w-full h-full">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead className="w-[40px]"></TableHead>
                                    <TableHead className="flex flex-row items-center flex-nowrap gap-2">
                                        <div>File Name</div>
                                        <div><LucideSortAsc className="w-3 h-3"/></div>
                                    </TableHead>
                                    <TableHead>Last Modified</TableHead>
                                    <TableHead className="text-right">Size</TableHead>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {sortedContent.map((treeNode, itemIndex) => {
                                    if (treeNode.fileObject && treeNode.fileObject.size) {
                                        totalSize += treeNode.fileObject.size;
                                    }
                                    return (
                                        <TableRow key={treeNode.path} className={itemIndex % 2 ? 'bg-white' : 'bg-slate-50'}>
                                            <TableCell>
                                                {(treeNode.fileObject || treeNode.children.length === 0) && (
                                                    <Checkbox
                                                        checked={!!selected[treeNode.path]}
                                                        onCheckedChange={handleSelectItem(treeNode.path)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="flex flex-row items-center gap-2 flex-nowrap">
                                                {treeNode.fileObject
                                                    ? (
                                                        <>
                                                            <FileIcon fileName={treeNode.name}/>
                                                            <div>{treeNode.name}</div>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            {treeNode.children.length > 0
                                                                ? (<LucideFolder className="w-3 h-3"/>)
                                                                : (<LucideFolderMinus className="w-3 h-3"/>)
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
                                                {treeNode.fileObject && (
                                                    <span>{getTimeDistance(treeNode.fileObject.timestamp)}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {treeNode.fileObject && treeNode.fileObject.size && (
                                                    <span>{humanReadableBytes(treeNode.fileObject.size)}</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 hover:bg-slate-100">
                                    <TableCell></TableCell>
                                    <TableCell colSpan={2}>Total</TableCell>
                                    <TableCell className="text-right">{humanReadableBytes(totalSize)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}
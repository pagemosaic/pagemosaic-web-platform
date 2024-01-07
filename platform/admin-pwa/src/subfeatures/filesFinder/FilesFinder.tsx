import {UserBucketData} from '@/data/UserBucketData';
import React, {useMemo, useState} from 'react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {LucideHome, LucideUpload, LucideFolderPlus, LucideSlash} from 'lucide-react';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {useFetcher} from 'react-router-dom';
import {UploadButton} from '@/subfeatures/filesFinder/UploadButton';
import {findNodeByPath, getParentNodes} from '@/utils/FileObjectUtils';
import {TreeNode} from 'infra-common/system/Bucket';
import {AsyncStatusError} from '@/components/utils/AsyncStatusError';
import {AddFolderButton} from '@/subfeatures/filesFinder/AddFolderButton';

interface FilesFinderProps {
    userBucketData: UserBucketData;
}

export function FilesFinder(props: FilesFinderProps) {
    const {userBucketData} = props;
    const fetcher = useFetcher();
    const [currentPath, setCurrentPath] = useState<string>('public');

    const currentNode: TreeNode = useMemo(() => {
        let result: TreeNode = {isRoot: true, path: 'public', name: 'public', children: []};
        if (userBucketData?.publicFilesRoots) {
            let foundCurrentDirNodeInNewTree: TreeNode | undefined = undefined;
            for (const rootTreeNode of userBucketData?.publicFilesRoots) {
                foundCurrentDirNodeInNewTree = findNodeByPath(rootTreeNode, currentPath);
                if (foundCurrentDirNodeInNewTree) {
                    result = foundCurrentDirNodeInNewTree;
                }
            }
        }
        console.log('currentNode calculated');
        return result;
    }, [userBucketData?.publicFilesRoots, currentPath]);

    console.log('[FilesFinder] roots: ', userBucketData?.publicFilesRoots);
    console.log('[FilesFinder] currentNode: ', currentNode);

    let folderPath: Array<TreeNode> = currentNode ? getParentNodes(currentNode) : [];
    if (folderPath.length > 3) {
        folderPath = folderPath.slice(-3);
    }

    const handleChangeCurrentPath = (newPath: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentPath(newPath);
    };

    return (
        <div className="w-full h-full p-4 flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
                <div>
                    <p className="text-xl">Files</p>
                </div>
                <ActionDataRequestError actionData={fetcher.data}/>
                <AsyncStatusError/>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <div>
                    <ButtonAction Icon={LucideHome} variant="outline"/>
                </div>
                {folderPath.map((folder) => {
                    return (
                        <div key={folder.path}>
                            <p>{folder.name} <span><LucideSlash className="w-3 h-3"/></span></p>
                        </div>
                    );
                })}
                <div>
                    <AddFolderButton node={currentNode}/>
                </div>
                <div>
                    <UploadButton node={currentNode}/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {currentNode.children.map((treeNode) => {
                    return (
                        <div key={treeNode.path}>
                            <p>
                                {treeNode.fileObject
                                    ? (
                                        <span>{treeNode.name}</span>
                                    )
                                    : (
                                        <a
                                            href="#"
                                            onClick={handleChangeCurrentPath(treeNode.path)}
                                            className="hover:underline text-blue-600"
                                        >
                                            {treeNode.name}
                                        </a>
                                    )
                                }

                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
import React, {useEffect, useState} from 'react';
import * as z from 'zod';
import Editor, {OnChange, useMonaco} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {languages} from 'monaco-editor/esm/vs/editor/editor.api';
import {ContentDataFieldTypes} from 'infra-common/data/ContentDataConfig';
import CompletionItemInsertTextRule = languages.CompletionItemInsertTextRule;
import {ButtonAction} from '@/components/utils/ButtonAction';
import {LucideX, LucideCheck} from 'lucide-react';
import {ContentData} from 'infra-common/data/ContentData';
import {buildOrUpdateContentObject} from '@/utils/PageUtils';
import {setSessionState} from '@/utils/localStorage';

interface CodeEditorJsonProps {
    code: string;
    readOnly?: boolean;
    onSubmit: (code: string) => void;
    onCancel: () => void;
}

// Define the ContentDataFieldTypes
const ZContentDataFieldTypes = z.enum(['image', 'text'], {
    errorMap: (issue, ctx) => ({message: 'Please select a correct field type'})
});

// Define the ContentDataFieldClass schema
const ZContentDataFieldClass = z.object({
    label: z.string().min(2, {
        message: 'The field label must be at least 2 characters',
    }),
    code: z.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
            message: 'The field code must start with a letter and contain only alphanumeric characters (letters and numbers)'
        })
        .min(2, {
            message: 'The field code must be at least 2 characters',
        }),
    type: ZContentDataFieldTypes,
    isArray: z.boolean().optional(),
});

// Define the ContentDataBlockClass schema
const ZContentDataBlockClass = z.object({
    label: z.string().min(2, {
        message: 'The block label must be at least 2 characters',
    }),
    code: z.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
            message: 'The block code must start with a letter and contain only alphanumeric characters (letters and numbers)'
        })
        .min(2, {
            message: 'The block code must be at least 2 characters',
        }),
    isArray: z.boolean().optional(),
    fields: z.array(ZContentDataFieldClass),
});

// Define the ContentDataConfigClass schema
const ZContentDataConfigClass = z.array(ZContentDataBlockClass);

const contentDataFieldClassSnippet = `{
    "label": "\${1:Field Label}",
    "code": "\${2:fieldCode}",
    "type": "\${3:text}",
    "isArray": \${4:false}
}`;

const contentDataBlockClassSnippet = `{
    "label": "\${1:Block Label}",
    "code": "\${2:blockCode}",
    "isArray": \${3:false},
    "fields": [
        {
            "label": "\${4:Field Label}",
            "code": "\${5:fieldCode}",
            "type": "\${6:text}",
            "isArray": \${7:false}
        }
    ]
}`;

const contentDataConfigClassSnippet = `[
    {
        "label": "\${1:Block Label}",
        "code": "\${2:blockCode}",
        "isArray": \${3:false},
        "fields": [
            {
                "label": "\${4:Field Label}",
                "code": "\${5:fieldCode}",
                "type": "\${6:text}",
                "isArray": \${7:false}
            }
        ]
    }
]`;

export function CodeEditorJson(props: CodeEditorJsonProps) {
    const {code, readOnly = false, onSubmit, onCancel} = props;
    const monaco = useMonaco();
    const [configErrors, setConfigErrors] = useState<Array<string>>([]);
    const [config, setConfig] = useState<string>();

    const handleEditorChange: OnChange = (value, event) => {
        setConfig(value || '');
    }

    const handleSubmitConfig = () => {
        if (config && config.length > 0) {
            try {
                const newContentDataConfigClass = JSON.parse(config);

                const dataConfigValidationResult = ZContentDataConfigClass.safeParse(newContentDataConfigClass);
                if (!dataConfigValidationResult.success) {
                    const flatErrors = dataConfigValidationResult.error.flatten();
                    const {fieldErrors} = flatErrors;
                    let newFieldErrors: Array<string> = [];
                    for (const [key, fieldError] of Object.entries(fieldErrors)) {
                        if (fieldError) {
                            newFieldErrors = newFieldErrors.concat(fieldError.map(i => {
                                return i.trim();
                            }));
                        }
                    }
                    setConfigErrors(newFieldErrors);
                } else {
                    setConfigErrors([]);
                    onSubmit(config);
                }
            } catch (e: any) {
                setConfigErrors([`Error parsing the content data. ${e.message}`]);
            }
        } else {
            setConfigErrors(['Content configuration should be not empty.']);
        }
    };

    useEffect(() => {
        if (monaco) {
            const providers: Array<monaco.IDisposable> = [];
            providers.push(
                monaco.languages.registerCompletionItemProvider('json', {
                    provideCompletionItems: (model, position): any => {
                        // const lineCount = model.getLineCount();
                        const firstLineContent = model.getLineContent(1);
                        const range = {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        };
                        if (firstLineContent.trim().length === 0) {
                            return {
                                suggestions: [
                                    {
                                        label: 'Insert a configuration structure',
                                        insertText: contentDataConfigClassSnippet,
                                        kind: monaco.languages.CompletionItemKind.Snippet,
                                        range,
                                        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
                                    } as monaco.languages.CompletionItem,
                                ],
                                incomplete: false
                            }
                        } else if (firstLineContent.endsWith('[')) {
                            if (model.getLineContent(position.lineNumber).trim().length === 0) {
                                return {
                                    suggestions: [
                                        {
                                            label: 'Insert a field structure',
                                            insertText: contentDataFieldClassSnippet,
                                            kind: monaco.languages.CompletionItemKind.Snippet,
                                            insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
                                            range
                                        },
                                        {
                                            label: 'Insert a block structure',
                                            insertText: contentDataBlockClassSnippet,
                                            kind: monaco.languages.CompletionItemKind.Snippet,
                                            insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
                                            range
                                        }
                                    ],
                                    incomplete: false
                                };
                            }
                        }
                        return {suggestions: []};
                    }
                })
            );

            providers.push(
                monaco.languages.registerCompletionItemProvider('json', {
                    triggerCharacters: ['"'],
                    provideCompletionItems: (model, position): any => {
                        const textUntilPosition = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        });
                        if (textUntilPosition.trim().startsWith('"type":') && textUntilPosition.endsWith('"')) {
                            const range = {
                                startLineNumber: position.lineNumber,
                                startColumn: position.column,
                                endLineNumber: position.lineNumber,
                                endColumn: position.column
                            };
                            const suggestions: Array<monaco.languages.CompletionItem> = ContentDataFieldTypes.map((variable: string) => ({
                                insertText: variable,
                                label: variable,
                                kind: monaco.languages.CompletionItemKind.Value,
                                documentation: variable,
                                range
                            }));
                            return {suggestions, incomplete: false};
                        }
                        return {suggestions: []};
                    }
                })
            );
            return () => {
                for (const provider of providers) {
                    provider.dispose();
                }
            };
        }
    }, [monaco]);

    return (
        <div className="h-full w-full flex flex-col gap-2">
            <div className="w-full flex flex-row items-center justify-end">
                <div>
                    <ButtonAction
                        variant="ghost"
                        size="sm"
                        label="Cancel"
                        Icon={LucideX}
                        onClick={onCancel}
                    />
                </div>
                <div>
                    <ButtonAction
                        variant="ghost"
                        size="sm"
                        label="Save"
                        Icon={LucideCheck}
                        onClick={handleSubmitConfig}
                    />
                </div>
            </div>
            {configErrors.map((configError, idx) => (
                <div key={`error${idx}`}>
                    <p className="text-xs text-red-600">{configError}</p>
                </div>
            ))}
            <Editor
                height="100%"
                width="100%"
                defaultLanguage="json"
                defaultValue={code}
                options={{
                    readOnly,
                    minimap: {enabled: false}
                }}
                onChange={handleEditorChange}
            />
        </div>
    );
}

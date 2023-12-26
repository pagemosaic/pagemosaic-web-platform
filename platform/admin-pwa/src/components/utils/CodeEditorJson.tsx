import React, {useEffect} from 'react';
import Editor, {OnChange, useMonaco} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {languages} from 'monaco-editor/esm/vs/editor/editor.api';
import {ContentDataFieldTypes} from 'infra-common/data/ContentDataConfig';
import CompletionItemInsertTextRule = languages.CompletionItemInsertTextRule;

interface CodeEditorJsonProps {
    code: string;
    readOnly?: boolean;
    onChange: (code: string) => void;
}

const contentDataFieldClassSnippet = `{
    "label": "\${1:Field Label}",
    "code": "\${2:fieldCode}",
    "type": "\${3:fieldType}",
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
            "type": "\${6:fieldType}",
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
                "type": "\${6:fieldType}",
                "isArray": \${7:false}
            }
        ]
    }
]`;

export function CodeEditorJson(props: CodeEditorJsonProps) {
    const {code, readOnly = false, onChange} = props;
    const monaco = useMonaco();

    const handleEditorChange: OnChange = (value, event) => {
        onChange(value || '');
    }

    useEffect(() => {
        if (monaco) {
            const providers: Array<monaco.IDisposable> = [];
            providers.push(
                monaco.languages.registerCompletionItemProvider('json', {
                    provideCompletionItems: (model, position): any => {
                        const lineCount = model.getLineCount();
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
    );
}
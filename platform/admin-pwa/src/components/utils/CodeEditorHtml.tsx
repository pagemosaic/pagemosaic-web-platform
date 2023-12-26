import React, {useEffect} from 'react';
import Editor, {OnChange, useMonaco} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {extractClassNames} from '@/utils/CssUtils';

interface CodeEditorHtmlProps {
    code: string;
    readOnly?: boolean;
    onChange: (code: string) => void;
    object: any; // Object structure for suggestions
    styles: string; // CSS code for suggestions
}


export function CodeEditorHtml(props: CodeEditorHtmlProps) {
    const {code, readOnly = false, onChange, object, styles} = props;
    const monaco = useMonaco();

    const handleEditorChange: OnChange = (value, event) => {
        onChange(value || '');
    }

    useEffect(() => {
        if (monaco) {
            const providers: Array<monaco.IDisposable> = [];
            providers.push(
                monaco.languages.registerCompletionItemProvider('html', {
                    provideCompletionItems: (model, position) => {
                        const textUntilPosition = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        });
                        const textAfterPosition = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: model.getLineMaxColumn(position.lineNumber)
                        });
                        const lastIndexOfStart = textUntilPosition.lastIndexOf('class="') + 7;
                        const lastIndexOfEnd = textAfterPosition.indexOf('"') + (position.column - 1);
                        const isInside = lastIndexOfStart > 7 && lastIndexOfEnd >= position.column - 1 && lastIndexOfEnd >= lastIndexOfStart;
                        if (isInside) {
                            const range = {
                                startLineNumber: position.lineNumber,
                                startColumn: position.column,
                                endLineNumber: position.lineNumber,
                                endColumn: position.column
                            };
                            const suggestions: Array<monaco.languages.CompletionItem> = extractClassNames(styles).map(key => ({
                                label: key,
                                kind: monaco.languages.CompletionItemKind.Keyword,
                                insertText: key,
                                range: range
                            }));
                            return {suggestions, incomplete: false};
                        }
                        return {suggestions: []};
                    }
                })
            );

            providers.push(
                monaco.languages.registerCompletionItemProvider('html', {
                    triggerCharacters: [' ', '.'],
                    provideCompletionItems: (model, position) => {
                        const textUntilPosition = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        });
                        const range = {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        };

                        const lastIndexOfStartHandlebars = textUntilPosition.lastIndexOf('{{');
                        const lastIndexOfEndHandlebars = textUntilPosition.lastIndexOf('}}');
                        const insideHandlebars = lastIndexOfStartHandlebars > 0 && lastIndexOfEndHandlebars < lastIndexOfStartHandlebars;
                        if (insideHandlebars) {
                            if (textUntilPosition.endsWith(' ')) {
                                const suggestions: Array<monaco.languages.CompletionItem> = Object.keys(object).map(key => ({
                                    label: key,
                                    kind: monaco.languages.CompletionItemKind.Property,
                                    insertText: key,
                                    range: range
                                }));

                                return {suggestions, incomplete: false};
                            } else if (textUntilPosition.endsWith('.')) {
                                const spaceIndex = textUntilPosition.lastIndexOf(' ');
                                const currentWord = model.getValueInRange({
                                    startLineNumber: position.lineNumber,
                                    startColumn: spaceIndex + 1,
                                    endLineNumber: position.lineNumber,
                                    endColumn: position.column
                                });
                                if (currentWord && currentWord.length > 0) {
                                    if (currentWord.includes('.')) {
                                        let obj = object;
                                        const path = currentWord.trim().split('.');
                                        console.log('path: ', path);
                                        for (let i = 0; i < path.length - 1; i++) {
                                            obj = obj[path[i]];
                                        }
                                        if (typeof obj !== 'object') return {suggestions: []};

                                        const suggestions: Array<monaco.languages.CompletionItem> = Object.keys(obj).map(key => ({
                                            label: key,
                                            kind: monaco.languages.CompletionItemKind.Variable,
                                            insertText: key,
                                            range: range
                                        }));

                                        return {suggestions, incomplete: false};
                                    } else {
                                        console.log('Return nothing...');
                                        return {suggestions: []};
                                    }
                                }
                            }
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
            defaultLanguage="html"
            defaultValue={code}
            options={{
                readOnly,
                minimap: {enabled: false}
            }}
            onChange={handleEditorChange}
        />
    );
}

import React, {useEffect} from 'react';
import Editor, {OnChange, useMonaco} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import openPropsTokens from '@/assets/open-props.tokens.json';
import {IDisposable} from 'monaco-editor/esm/vs/editor/editor.api';

interface CodeEditorCssProps {
    code: string;
    readOnly?: boolean;
    onChange: (code: string) => void;
}

export function CodeEditorCss(props: CodeEditorCssProps) {
    const {code, readOnly = false, onChange} = props;

    const monaco = useMonaco();

    const handleEditorChange: OnChange = (value, event) => {
        onChange(value || '');
    }

    useEffect(() => {
        if (monaco) {
            const provider: IDisposable = monaco.languages.registerCompletionItemProvider('css', {
                triggerCharacters: ['-'],
                provideCompletionItems: (model, position): any => {
                    const textUntilPosition = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    });
                    const lastIndexOfStart = textUntilPosition.lastIndexOf('var(');
                    const lastIndexOfEnd = textUntilPosition.lastIndexOf(')');
                    const isInside = lastIndexOfStart > 0 && lastIndexOfEnd < lastIndexOfStart;
                    if (isInside) {
                        const range = {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        };
                        const suggestions: Array<monaco.languages.CompletionItem> = Object.keys(openPropsTokens).map((variable: string) => ({
                            insertText: variable,
                            label: variable,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            documentation: variable,
                            range
                        }));
                        return {suggestions, incomplete: false};
                    }
                    return {suggestions: []};
                }
            });
            return () => {
                if (provider) {
                    provider.dispose();
                }
            };
        }
    }, [monaco]);

    return (
        <Editor
            height="100%"
            width="100%"
            defaultLanguage="css"
            defaultValue={code}
            options={{
                readOnly,
                minimap: {enabled: false}
            }}
            onChange={handleEditorChange}
        />
    );
}
import React from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import openPropsTokens from '@/assets/open-props.tokens.json';

interface CodeEditorCssProps {
    code: string;
    readOnly?: boolean;
    onChange: (code: string) => void;
}

const handleEditorWillMount: OnMount = (editor, monaco) => {
    monaco.languages.register({id: 'css'});

    monaco.languages.registerCompletionItemProvider('css', {
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
                return {suggestions, incomplete: true};
            }
            return {suggestions: []};
        }
    });
};

export function CodeEditorCss(props: CodeEditorCssProps) {
    const {code, readOnly = false, onChange} = props;
    const handleEditorChange: OnChange = (value, event) => {
        onChange(value || '');
    }

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
            onMount={handleEditorWillMount}
        />
    );
}
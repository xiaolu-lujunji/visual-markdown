import React from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import styled from '@mui/material/styles/styled';
import type { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import type { Text } from '@codemirror/state';
import type { RenderElementProps } from 'slate-react';
import type { Code as CodeSpec } from '../../spec';

const languages = [
  { label: 'HTML', lang: 'html' },
  { label: 'CSS', lang: 'css' },
  {
    label: 'JavaScript',
    lang: 'javascript',
  },
];

const language = (lang: string) => {
  switch (lang) {
    case 'html':
      return html;
    case 'css':
      return css;
    default:
      return javascript;
  }
};

const CodeMirrorRoot = styled('div')({
  '.cm-line': {
    fontFamily: '"Lucida Console", Consolas, "Courier", monospace',
  },
});

export default function Code(props: RenderElementProps) {
  const { element, attributes, children } = props;
  const { value, lang, autoFocus } = element as CodeSpec;

  const editor = useSlateStatic();

  const handleDocChanged = (doc: Text) => {
    const newValue = doc.toString();
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { value: newValue }, { at: path });
  };
  const onDocChangedRef = React.useRef(handleDocChanged);
  onDocChangedRef.current = handleDocChanged;

  const state = React.useMemo(
    () =>
      EditorState.create({
        doc: value,
        extensions: [
          EditorView.domEventHandlers({
            beforeinput: (event) => {
              event.stopPropagation();
              return false;
            },
            keydown: (event) => {
              event.stopPropagation();
              return false;
            },
          }),
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
          ]),
          language(lang ?? 'javascript')(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onDocChangedRef.current?.(update.state.doc);
            }
          }),
        ],
      }),
    [lang],
  );

  const view = React.useMemo(
    () =>
      new EditorView({
        state,
        parent: undefined,
      }),
    [state],
  );
  React.useEffect(() => {
    view.focus();
  }, [view]);

  const parent = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null) {
        if (node.firstChild) node.removeChild(node.firstChild);
        node.appendChild(view.dom);
      }
    },
    [view],
  );

  const input = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (autoFocus) {
      input.current?.focus();
    }
  }, []);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: { label: string; lang: string } | null,
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'selectOption') {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { lang: value?.lang }, { at: path });
    }
  };

  return (
    <div {...attributes} contentEditable={false}>
      {children}
      <Autocomplete
        disablePortal
        options={languages}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField inputRef={input} {...params} label="Language" />}
        onChange={handleChange}
      />
      <CodeMirrorRoot ref={parent} />
    </div>
  );
}

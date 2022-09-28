import Popover from '@mui/material/Popover';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
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
import parse from 'html-react-parser';
import { sanitize } from 'dompurify';
import styled from '@mui/material/styles/styled';
import type { RenderElementProps } from 'slate-react';
import type { Text } from '@codemirror/state';
import type { HTMLReactParserOptions } from 'html-react-parser';
import type { HTML as HTMLSpec } from '../../spec';

const PreviewRoot = styled('div')({
  whiteSpace: 'normal',
  '&:hover': {
    backgroundColor: '#f5f6f7',
  },
});

const CodeMirrorRoot = styled('div')({
  '.cm-line': {
    fontFamily: '"Lucida Console", Consolas, "Courier", monospace',
  },
});

export interface HTMLProps extends RenderElementProps {
  parserOptions?: HTMLReactParserOptions;
}

export default function HTML(props: HTMLProps) {
  const { element, attributes, children, parserOptions } = props;

  const { value, autoFocus } = element as HTMLSpec;

  const editor = useSlateStatic();

  const anchor = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      setOpen(true);
      setTimeout(() => {
        view.focus();
      }, 0);
    }
  }, []);

  const handleDoubleClick = () => {
    setOpen(true);
    setTimeout(() => {
      view.focus();
    }, 0);
  };

  const handleDocChanged = (doc: Text) => {
    const newValue = doc.toString();
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { value: newValue }, { at: path });
  };
  const onDocChangedRef = useRef(handleDocChanged);
  onDocChangedRef.current = handleDocChanged;

  const state = useMemo(
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
          html(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onDocChangedRef.current?.(update.state.doc);
            }
          }),
        ],
      }),
    [],
  );

  const view = useMemo(
    () =>
      new EditorView({
        state,
        parent: undefined,
      }),
    [state],
  );

  const parent = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.appendChild(view.dom);
    }
  }, []);

  return (
    <div {...attributes} contentEditable={false}>
      {children}
      <PreviewRoot ref={anchor} onDoubleClick={handleDoubleClick}>
        {parse(sanitize(value), parserOptions)}
      </PreviewRoot>
      <Popover
        open={open}
        anchorEl={anchor.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <CodeMirrorRoot ref={parent} />
      </Popover>
    </div>
  );
}

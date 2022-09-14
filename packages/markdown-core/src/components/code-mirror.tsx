import React from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { html } from '@codemirror/lang-html';
import type { Text } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';

const stopPropagation = EditorView.domEventHandlers({
  beforeinput: (event) => {
    event.stopPropagation();
    return false;
  },
  keydown: (event) => {
    event.stopPropagation();
    return false;
  },
});

const language = (lang?: string) => {
  switch (lang) {
    case 'html':
      return html;
    default:
      return html;
  }
};

interface CodeMirrorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  doc?: string | Text;
  lang?: string;
  onDocChanged?: (doc: Text) => void;
}

export default function CodeMirror(props: CodeMirrorProps) {
  const { doc, lang, onDocChanged, ...other } = props;

  const onDocChangedRef = React.useRef(onDocChanged);
  onDocChangedRef.current = onDocChanged;

  const state = React.useMemo(
    () =>
      EditorState.create({
        doc,
        extensions: [
          stopPropagation,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onDocChangedRef.current?.(update.state.doc);
            }
          }),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          language(lang)(),
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

  const parent = React.useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.appendChild(view.dom);
    }
  }, []);

  return <div ref={parent} {...other} />;
}

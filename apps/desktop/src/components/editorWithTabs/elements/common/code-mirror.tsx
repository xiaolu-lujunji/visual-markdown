import React from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import stopPropagation from "./extensions/stop-propagation";
import language from "./language";
import type { Text } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import "./themes/github.scss";

interface CodeMirrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  doc?: string | Text;
  lang?: string;
  onDocChanged?: (doc: Text) => void;
}

export default function CodeMirror(props: CodeMirrorProps) {
  const { doc, lang, onDocChanged, ...other } = props;

  const handleUpdate = React.useRef((update: ViewUpdate) => {
    if (update.docChanged) {
      onDocChanged?.(update.state.doc);
    }
  });

  const state = React.useMemo(
    () =>
      EditorState.create({
        doc,
        extensions: [
          stopPropagation,
          EditorView.updateListener.of(handleUpdate.current),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          language(lang)(),
        ],
      }),
    [lang]
  );

  const view = React.useMemo(
    () =>
      new EditorView({
        state,
        parent: undefined,
      }),
    [state]
  );

  const parent = React.useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.appendChild(view.dom);
    }
  }, []);

  return <div ref={parent} {...other} />;
}

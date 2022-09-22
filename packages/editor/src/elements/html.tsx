import React from 'react';
import Popover from '@mui/material/Popover';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
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
import stopPropagation from '../lib/code-mirror/stop-propagation';
import parse, { Element, attributesToProps } from 'html-react-parser';
import { sanitize } from 'dompurify';
import { RewriteImageSrcContext } from '../editable';
import styled from '@mui/material/styles/styled';
import type { RenderElementProps } from 'slate-react';
import type { Text } from '@codemirror/state';
import type { HTMLReactParserOptions } from 'html-react-parser';
import type { HTML as HTMLSpec } from '../spec';

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

export default function HTML(props: RenderElementProps) {
  const { element, attributes, children } = props;

  const { value, autoFocus } = element as HTMLSpec;

  const editor = useSlateStatic();

  const anchor = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const rewriteImageSrc = React.useContext(RewriteImageSrcContext);
  const options = React.useMemo<HTMLReactParserOptions>(
    () => ({
      replace: (domNode) => {
        // TODO: why domNode instanceof Element is false?
        if (domNode instanceof Element && domNode.tagName === 'img' && domNode.attribs) {
          const { src, ...other } = attributesToProps(domNode.attribs);
          return (
            <img src={rewriteImageSrc.current ? rewriteImageSrc.current(src) : src} {...other} />
          );
        }
        // if (domNode.tagName === 'a' && domNode.attribs) {
        //   const props = attributesToProps(domNode.attribs);
        //   return (
        //     <a {...props} onClick={() => open(props.href)}>
        //       {domToReact(domNode.children, options)}
        //     </a>
        //   );
        // }
      },
    }),
    [rewriteImageSrc],
  );

  React.useEffect(() => {
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
  const onDocChangedRef = React.useRef(handleDocChanged);
  onDocChangedRef.current = handleDocChanged;

  const state = React.useMemo(
    () =>
      EditorState.create({
        doc: value,
        extensions: [
          stopPropagation,
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

  return (
    <div {...attributes} contentEditable={false}>
      {children}
      <PreviewRoot ref={anchor} onDoubleClick={handleDoubleClick}>
        {parse(sanitize(value), options)}
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

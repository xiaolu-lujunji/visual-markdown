import { Editor, Node, Element, Range, Transforms } from 'slate';
import type { ReactEditor } from 'slate-react';

const HTML_REG = /^<([a-zA-Z\d-]+)(?=\s|>)[^<>]*?>$/;

export default function withHTML(editor: ReactEditor) {
  const { isVoid, insertBreak } = editor;

  editor.isVoid = (element) => element.type === 'html' || isVoid(element);

  editor.insertBreak = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      });
      if (nodeEntry) {
        const [node, path] = nodeEntry;
        const searchResult = HTML_REG.exec(Node.string(node));
        if (searchResult) {
          const [, tag] = searchResult;
          Transforms.insertNodes(
            editor,
            {
              type: 'html',
              value: `<${tag}></${tag}>`,
              autoFocus: true,
              children: [{ text: '' }],
            },
            {
              at: path,
            },
          );
          editor.deleteBackward('word');
          return;
        }
      }
    }

    insertBreak();
  };

  return editor;
}

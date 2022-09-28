import { Editor, Element, Node, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import type { ReactEditor } from 'slate-react';

const CODE_REG = /^`{2,}$/;

export function keyDownCode(editor: ReactEditor, event: React.KeyboardEvent<HTMLDivElement>) {
  if (isHotkey('`') && editor.selection && Range.isCollapsed(editor.selection)) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      const searchResult = CODE_REG.exec(Node.string(node));
      if (searchResult) {
        editor.deleteBackward('word');
        Transforms.insertNodes(
          editor,
          { type: 'code', value: '', autoFocus: true, children: [{ text: '' }] },
          {
            at: path,
          },
        );
        return true;
      }
    }
  }
  return false;
}

export default function withCode(editor: ReactEditor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => element.type === 'code' || isVoid(element);

  return editor;
}

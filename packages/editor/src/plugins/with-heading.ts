import { Editor, Element, Node, Point, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import type { ReactEditor } from 'slate-react';

const HEADING_REG = /^ {0,3}(#{1,6})$/;

export function keyDownHeading(editor: ReactEditor, event: React.KeyboardEvent<HTMLDivElement>) {
  if (isHotkey('space')(event) && editor.selection && Range.isCollapsed(editor.selection)) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      const searchResult = HEADING_REG.exec(Node.string(node));
      if (searchResult) {
        event.preventDefault();
        const [, numberSigns] = searchResult;
        const depth = numberSigns.length as 1 | 2 | 3 | 4 | 5 | 6;
        Transforms.setNodes(
          editor,
          { type: 'heading', depth },
          {
            at: path,
          },
        );
        editor.deleteBackward('word');
        return true;
      }
    }
  }
  return false;
}

export default function withHeading(editor: ReactEditor) {
  const { deleteBackward, insertBreak } = editor;

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'heading',
      });
      if (nodeEntry) {
        const [, path] = nodeEntry;
        if (Point.equals(Editor.start(editor, path), editor.selection.anchor)) {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.insertBreak = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'heading',
      });
      if (nodeEntry) {
        const [, path] = nodeEntry;
        if (Point.equals(Editor.end(editor, path), editor.selection.anchor)) {
          Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
          return;
        }
      }
    }

    insertBreak();
  };

  return editor;
}

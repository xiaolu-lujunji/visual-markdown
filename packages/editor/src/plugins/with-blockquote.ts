import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import type { ReactEditor } from 'slate-react';

const BLOCKQUOTE_REG = /^( {0,3}>$)/;

export function keyDownBlockquote(editor: ReactEditor, event: React.KeyboardEvent<HTMLDivElement>) {
  if (isHotkey('space')(event) && editor.selection && Range.isCollapsed(editor.selection)) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      const searchResult = BLOCKQUOTE_REG.exec(Node.string(node));
      if (searchResult) {
        event.preventDefault();
        Transforms.wrapNodes(
          editor,
          { type: 'blockquote', children: [] },
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

export default function withBlockquote(editor: ReactEditor) {
  const { insertBreak, deleteBackward } = editor;

  editor.insertBreak = () => {
    const blockquoteEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'blockquote',
    });
    if (blockquoteEntry) {
      const [blockquote, blockquotePath] = blockquoteEntry;
      const lastChild = blockquote.children.at(-1);
      if (
        Element.isElement(lastChild) &&
        lastChild.type === 'paragraph' &&
        Node.string(lastChild) === ''
      ) {
        Transforms.liftNodes(editor, {
          at: blockquotePath.concat(blockquote.children.length - 1),
        });
        return;
      }
    }

    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'blockquote',
      });
      if (nodeEntry) {
        const [, path] = nodeEntry;
        if (Point.equals(Editor.start(editor, path), editor.selection.anchor)) {
          Transforms.insertNodes(
            editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            {
              at: path,
            },
          );
          Transforms.removeNodes(editor, {
            at: Path.next(path),
          });
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  return editor;
}

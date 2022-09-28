import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import type { ReactEditor } from 'slate-react';

const THEMATIC_BREAK_REG = /^ {0,3}((?:-[\t ]*){2,}|(?:_[ \t]*){2,}|(?:\*[ \t]*){2,})(?:\n+|$)/;

const isThematicBreak = (event: React.KeyboardEvent<HTMLDivElement>) =>
  event.key === '-' || event.key === '_' || event.key === '*';

export function keyDownThematicBreak(
  editor: ReactEditor,
  event: React.KeyboardEvent<HTMLDivElement>,
) {
  if (isThematicBreak(event) && editor.selection && Range.isCollapsed(editor.selection)) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      const searchResult = THEMATIC_BREAK_REG.exec(Node.string(node));
      if (searchResult) {
        event.preventDefault();
        Transforms.insertNodes(
          editor,
          {
            type: 'thematicBreak',
            children: [{ text: '' }],
          },
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

export default function withThematicBreak(editor: ReactEditor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => element.type === 'thematicBreak' || isVoid(element);

  return editor;
}

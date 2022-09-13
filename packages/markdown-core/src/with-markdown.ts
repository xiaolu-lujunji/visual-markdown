import { Range, Editor, Point, Transforms, Element, Path } from 'slate';
import { isHeading } from './common';
import type { BaseEditor, NodeMatch, Ancestor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Heading, Blockquote } from './spec';

const isBlockquote: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'blockquote';

export default function withMarkdown(editor: BaseEditor & ReactEditor) {
  const { isVoid, deleteBackward } = editor;

  editor.isVoid = (element) => element.type === 'thematicBreak' || isVoid(element);

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const headingEntry = Editor.above<Heading>(editor, {
        match: isHeading,
      });
      if (headingEntry) {
        const [, headingPath] = headingEntry;
        const start = Editor.start(editor, headingPath);
        if (Point.equals(editor.selection.anchor, start)) {
          Transforms.setNodes(
            editor,
            { type: 'paragraph' },
            {
              at: headingPath,
            },
          );
          return;
        }
      }

      const blockquoteEntry = Editor.above<Blockquote>(editor, { match: isBlockquote });
      if (blockquoteEntry) {
        const [, blockquotePath] = blockquoteEntry;
        const start = Editor.start(editor, blockquotePath);
        if (Point.equals(editor.selection.anchor, start)) {
          Transforms.insertNodes(
            editor,
            { type: 'paragraph', children: [{ text: '' }] },
            { at: blockquotePath },
          );
          Transforms.removeNodes(editor, { at: Path.next(blockquotePath) });
          return;
        }
      }
    }
    deleteBackward(unit);
  };

  return editor;
}

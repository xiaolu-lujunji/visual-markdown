import { Editor, Point, Transforms, Element, Path } from 'slate';
import { isHeading } from './common';
import type { BaseEditor, NodeMatch, Ancestor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Heading, Blockquote, List } from './spec';

const isBlockquote: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'blockquote';

const isList: NodeMatch<Ancestor> = (node) => Element.isElement(node) && node.type === 'list';

export default function withMarkdown(editor: BaseEditor & ReactEditor) {
  const { isVoid, isInline, deleteBackward } = editor;

  editor.isVoid = (element) =>
    element.type === 'thematicBreak' ||
    element.type === 'html' ||
    element.type === 'code' ||
    isVoid(element);

  editor.isInline = (element) => element.type === 'link' || isInline(element);

  editor.deleteBackward = (unit) => {
    const headingEntry = Editor.above<Heading>(editor, {
      match: isHeading,
    });
    if (headingEntry) {
      const [, headingPath] = headingEntry;
      const start = Editor.start(editor, headingPath);
      if (Point.equals(editor.selection!.anchor, start)) {
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
      if (Point.equals(editor.selection!.anchor, start)) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: blockquotePath },
        );
        Transforms.removeNodes(editor, { at: Path.next(blockquotePath) });
        return;
      }
    }

    const listEntry = Editor.above<List>(editor, { match: isList });
    if (listEntry) {
      const [, listPath] = listEntry;
      const start = Editor.start(editor, listPath);
      if (Point.equals(editor.selection!.anchor, start)) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: listPath },
        );
        Transforms.removeNodes(editor, { at: Path.next(listPath) });
        return;
      }
    }

    deleteBackward(unit);
  };

  return editor;
}

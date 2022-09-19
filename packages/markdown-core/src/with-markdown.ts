import { Editor, Point, Transforms, Element, Path } from 'slate';
import { isHeading } from './common';
import type { BaseEditor, NodeMatch, Ancestor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Paragraph } from './spec';

const isBlockquote: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'blockquote';

const isList: NodeMatch<Ancestor> = (node) => Element.isElement(node) && node.type === 'list';

function transformNodeToParagraph(editor: BaseEditor & ReactEditor, match: NodeMatch<Ancestor>) {
  const entry = Editor.above(editor, {
    match,
  });
  if (entry) {
    const [, path] = entry;
    const start = Editor.start(editor, path);
    if (Point.equals(editor.selection!.anchor, start)) {
      const paragraph: Paragraph = { type: 'paragraph', children: [{ text: '' }] };
      Transforms.insertNodes(editor, paragraph, { at: path });
      Transforms.removeNodes(editor, { at: Path.next(path) });
      return true;
    }
  }
  return false;
}

export default function withMarkdown(editor: BaseEditor & ReactEditor) {
  const { isVoid, isInline, deleteBackward } = editor;

  editor.isVoid = (element) =>
    element.type === 'thematicBreak' ||
    element.type === 'html' ||
    element.type === 'code' ||
    isVoid(element);

  editor.isInline = (element) => element.type === 'link' || isInline(element);

  editor.deleteBackward = (unit) => {
    if (transformNodeToParagraph(editor, isHeading)) return;

    if (transformNodeToParagraph(editor, isBlockquote)) return;

    if (transformNodeToParagraph(editor, isList)) return;

    deleteBackward(unit);
  };

  return editor;
}

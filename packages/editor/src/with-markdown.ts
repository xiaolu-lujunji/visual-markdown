import { Editor, Point, Transforms, Element, Path, Range, Node } from 'slate';
import { isParagraph, isHeading } from './common';
import type { BaseEditor, NodeMatch, Ancestor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Paragraph, Heading } from './spec';

const HTML_REG = /^<([a-zA-Z\d-]+)(?=\s|>)[^<>]*?>$/;

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
  const { isVoid, isInline, deleteBackward, insertBreak } = editor;

  editor.isVoid = (element) =>
    element.type === 'thematicBreak' ||
    element.type === 'html' ||
    element.type === 'code' ||
    isVoid(element);

  editor.isInline = (element) => element.type === 'link' || isInline(element);

  editor.insertBreak = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const headingEntry = Editor.above<Heading>(editor, { match: isHeading });
      if (headingEntry) {
        const [, headingPath] = headingEntry;
        const end = Editor.end(editor, headingPath);
        if (Point.equals(editor.selection.anchor, end)) {
          Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
          return;
        }
      }

      const paragraphEntry = Editor.above<Paragraph>(editor, {
        match: isParagraph,
      });
      if (paragraphEntry) {
        const [paragraph, paragraphPath] = paragraphEntry;
        const text = Node.string(paragraph);
        const htmlSearchResult = HTML_REG.exec(text);
        if (htmlSearchResult) {
          const [, tag] = htmlSearchResult;
          Transforms.insertNodes(
            editor,
            {
              type: 'html',
              value: `<${tag}></${tag}>`,
              autoFocus: true,
              children: [{ text: '' }],
            },
            {
              at: paragraphPath,
            },
          );
          editor.deleteBackward('word');
          return;
        }
      }
    }
    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    if (transformNodeToParagraph(editor, isHeading)) return;

    if (transformNodeToParagraph(editor, isBlockquote)) return;

    if (transformNodeToParagraph(editor, isList)) return;

    deleteBackward(unit);
  };

  return editor;
}

import {
  BaseEditor,
  Editor,
  Element,
  Node,
  Path,
  Point,
  Range,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { createParagraph } from "./common";

const HEADING_REG = /^ {0,3}(#{1,6}) /;
const BLOCKQUOTE_REG = /^( {0,3}> )/;
const LIST_REG = /^( {0,3}(?:[*+-]|\d{1,9}[.)])) /;

export default function withMarkdown(editor: BaseEditor & ReactEditor) {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    element.type === "thematicBreak" ||
    element.type === "html" ||
    element.type === "image" ||
    isVoid(element);

  const { isInline } = editor;
  editor.isInline = (element) => element.type === "link" || isInline(element);

  const { insertText } = editor;
  editor.insertText = (text) => {
    insertText(text);
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above<Element>(editor, {
        match: (node) => Element.isElement(node),
      });
      if (nodeEntry) {
        const [node, path] = nodeEntry;
        if (node.type === "paragraph") {
          const text = Node.string(node);

          let cap: RegExpExecArray | null = null;
          cap = HEADING_REG.exec(text);
          if (cap) {
            Transforms.insertNodes(
              editor,
              {
                type: "heading",
                depth: cap[1].length as 1 | 2 | 3 | 4 | 5 | 6,
                children: [{ text: "" }],
              },
              {
                at: path,
              }
            );

            Transforms.removeNodes(editor, {
              at: Path.next(path),
            });

            return;
          }

          if (BLOCKQUOTE_REG.test(text)) {
            Transforms.insertNodes(
              editor,
              {
                type: "blockquote",
                children: [createParagraph()],
              },
              {
                at: path,
              }
            );

            Transforms.removeNodes(editor, {
              at: Path.next(path),
            });

            return;
          }

          cap = LIST_REG.exec(text);

          if (cap) {
            const bull = cap[1].trim();
            const ordered = bull.length > 1;
            Transforms.insertNodes(
              editor,
              {
                type: "list",
                ordered,
                start: ordered ? +bull.slice(0, -1) : undefined,
                spread: false,
                children: [
                  {
                    type: "listItem",
                    spread: false,
                    children: [createParagraph()],
                  },
                ],
              },
              {
                at: path,
              }
            );

            Transforms.removeNodes(editor, {
              at: Path.next(path),
            });
          }
        }
      }
    }
  };

  const { deleteBackward } = editor;
  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above<Element>(editor, {
        match: (node) =>
          Element.isElement(node) &&
          (node.type === "heading" ||
            node.type === "blockquote" ||
            node.type === "list"),
      });
      if (nodeEntry) {
        const [, path] = nodeEntry;
        const start = Editor.start(editor, path);
        if (Point.equals(editor.selection.anchor, start)) {
          Transforms.insertNodes(editor, createParagraph(), {
            at: path,
          });
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

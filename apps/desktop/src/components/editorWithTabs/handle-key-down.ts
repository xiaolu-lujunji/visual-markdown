import isHotkey from "is-hotkey";
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
import type { ReactEditor } from "slate-react";
import { createParagraph } from "./common";

const HOTKEYS = {
  isEnter: isHotkey("enter"),
};

const THEMATIC_BREAK_REG =
  /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;

export default function handleKeyDown(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: BaseEditor & ReactEditor
) {
  if (
    HOTKEYS.isEnter(event) &&
    editor.selection &&
    Range.isCollapsed(editor.selection)
  ) {
    const nodeEntry = Editor.above<Element>(editor, {
      match: (node) => Element.isElement(node),
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      if (
        node.type === "heading" &&
        Point.equals(editor.selection.anchor, Editor.end(editor, path))
      ) {
        event.preventDefault();
        Transforms.insertNodes(editor, createParagraph());
      } else if (
        node.type === "paragraph" &&
        Point.equals(editor.selection.anchor, Editor.end(editor, path))
      ) {
        const listItemEntry = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === "listItem",
          at: path,
        });
        if (listItemEntry) {
          event.preventDefault();
          Transforms.splitNodes(editor, {
            // always: true,
            // height: 2,
            match: (node) =>
              Element.isElement(node) && node.type === "listItem",
            // at: path,
          });
          return;
        }
        event.preventDefault();
        const text = Node.string(node);
        if (THEMATIC_BREAK_REG.test(text)) {
          Transforms.insertNodes(
            editor,
            [
              {
                type: "thematicBreak",
                children: [{ text: "" }],
              },
              createParagraph(),
            ],
            {
              at: path,
            }
          );
          Transforms.removeNodes(editor, {
            at: Path.next(Path.next(path)),
          });
        }
      }
    }
  }
}

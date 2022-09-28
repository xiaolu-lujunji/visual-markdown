import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import type { ReactEditor } from 'slate-react';

const LIST_REG = /^ {0,3}(?:[*+-]|(\d{1,9})[.)])/;

export function keyDownList(editor: ReactEditor, event: React.KeyboardEvent<HTMLDivElement>) {
  if (isHotkey('space')(event) && editor.selection && Range.isCollapsed(editor.selection)) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (nodeEntry) {
      const [node, path] = nodeEntry;
      const searchResult = LIST_REG.exec(Node.string(node));
      if (searchResult) {
        event.preventDefault();
        const [, start] = searchResult;
        const ordered = start !== undefined;
        Transforms.insertNodes(
          editor,
          {
            type: 'list',
            ordered,
            start: ordered ? window.parseInt(start, 10) : undefined,
            children: [
              { type: 'listItem', children: [{ type: 'paragraph', children: [{ text: '' }] }] },
            ],
          },
          {
            at: path,
          },
        );
        Transforms.removeNodes(editor, {
          at: Path.next(path),
        });
        return true;
      }
    }
  } else if (
    isHotkey('shift?+tab')(event) &&
    editor.selection &&
    Range.isCollapsed(editor.selection)
  ) {
    const nodeEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'listItem',
    });
    if (nodeEntry) {
      event.preventDefault();
      const [, path] = nodeEntry;
      if (event.shiftKey) {
        Transforms.liftNodes(editor, {
          at: path,
        });
      } else {
        try {
          const previousListItemPath = Path.previous(path);
          const previousListItem = Node.get(editor, previousListItemPath);
          if (
            previousListItem &&
            Element.isElement(previousListItem) &&
            previousListItem.type === 'listItem'
          ) {
            Transforms.wrapNodes(
              editor,
              { type: 'list', children: [] },
              {
                at: path,
              },
            );
            Transforms.moveNodes(editor, {
              at: path,
              to: previousListItemPath.concat(previousListItem.children.length),
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
      return true;
    }
  }
  return false;
}

export default function withList(editor: ReactEditor) {
  const { deleteBackward, insertBreak } = editor;

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const nodeEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'list',
      });
      if (nodeEntry) {
        const [, path] = nodeEntry;
        if (Point.equals(Editor.start(editor, path), editor.selection.anchor)) {
          Transforms.insertNodes(
            editor,
            { type: 'paragraph', children: [{ text: '' }] },
            { at: path },
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

  editor.insertBreak = () => {
    if (!editor.selection) return;

    const listItemEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'listItem',
    });
    // If selection is in a li
    if (listItemEntry) {
      const [listItem, listItemPath] = listItemEntry;
      const [list, listPath] = Editor.parent(editor, listItemPath);
      // If selected li is empty, move it up.
      const paragraphEntry = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      });
      if (paragraphEntry && Node.string(paragraphEntry[0]) === '') {
        const ancestorListItemEntry = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === 'listItem',
          at: listPath,
        });
        if (ancestorListItemEntry) {
        } else {
          Transforms.liftNodes(editor, {
            at: listItemPath,
          });
          Transforms.unwrapNodes(editor, {
            match: (node) => Element.isElement(node) && node.type === 'listItem',
          });

          const hasListChild = listItem.children.some(
            (child) => Element.isElement(child) && child.type === 'list',
          );
          const notLastChild = list.children.length - 1 !== listItemPath.at(-1);
          if (hasListChild && notLastChild) {
            Transforms.mergeNodes(editor, {
              at: Path.next(Path.next(Path.next(listPath))),
            });
          }
          return;
        }
      }
      // If selection is in li > p, insert li.
      const nextListItemPath = Path.next(listItemPath);
      Transforms.insertNodes(
        editor,
        { type: 'listItem', children: [{ type: 'paragraph', children: [{ text: '' }] }] },
        {
          at: nextListItemPath,
        },
      );
      Transforms.select(editor, nextListItemPath);
      return;
    }

    insertBreak();
  };

  return editor;
}

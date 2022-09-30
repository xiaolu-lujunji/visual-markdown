import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import moveListItemUp from './move-list-up';
import { isListItem, isListNested, hasListChild, lastChildPath } from './helpers';
import type { Ancestor } from 'slate';
import type { ReactEditor } from 'slate-react';

export default function withList(editor: ReactEditor) {
  const { deleteBackward, insertBreak } = editor;

  editor.insertBreak = () => {
    if (editor.selection) {
      const listItemEntry = Editor.above(editor, {
        match: isListItem,
      });
      // If selection is in a li
      if (listItemEntry) {
        const [, listItemPath] = listItemEntry;

        // If selected li is empty, move it up.
        const paragraphEntry = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === 'paragraph',
        });
        if (paragraphEntry && Node.string(paragraphEntry[0]) === '') {
          moveListItemUp(editor, listItemEntry);
          return;
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
    }

    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const listItemEntry = Editor.above(editor, {
        match: isListItem,
      });
      if (listItemEntry) {
        const [listItem, listItemPath] = listItemEntry;
        if (Point.equals(Editor.start(editor, listItemPath), editor.selection.anchor)) {
          const nested = isListNested(editor, listItemPath);
          if (nested && hasListChild(listItem)) {
            if (Path.hasPrevious(listItemPath)) {
              // move sub-lis to the previous li
              const previousListItemPath = Path.previous(listItemPath);
              const previousListItem = Node.get(editor, previousListItemPath) as Ancestor;
              const previousListItemHasListChild = hasListChild(previousListItem);

              deleteBackward(unit);
              Transforms.mergeNodes(editor, {
                at: listItemPath,
              });

              if (previousListItemHasListChild) {
                const newPreviousListItem = Node.get(editor, previousListItemPath) as Ancestor;
                Transforms.mergeNodes(editor, {
                  at: lastChildPath([newPreviousListItem, previousListItemPath]),
                });
              }
              return;
            } else {
              // move the sublist to the parent list
              const originalChildListPath = Path.next(listItemPath.concat(0));
              const currentChildListPath = Path.next(listItemPath);
              Transforms.moveNodes(editor, {
                at: originalChildListPath,
                to: currentChildListPath,
              });
              Transforms.unwrapNodes(editor, {
                at: currentChildListPath,
              });
            }
          }

          if (!nested) {
            moveListItemUp(editor, listItemEntry);
            return;
          }

          // Transforms.insertNodes(
          //   editor,
          //   { type: 'paragraph', children: [{ text: '' }] },
          //   { at: path },
          // );
          // Transforms.removeNodes(editor, {
          //   at: Path.next(path),
          // });
          // return;
        }
      }
    }

    deleteBackward(unit);
  };

  return editor;
}

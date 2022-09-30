import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';

const LIST_REG = /^ {0,3}(?:[*+-]|(\d{1,9})[.)])/;

export default function keyDownList(editor: Editor, event: React.KeyboardEvent<HTMLDivElement>) {
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
        Transforms.select(editor, path);
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

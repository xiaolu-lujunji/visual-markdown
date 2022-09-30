import { Editor, Element, Node, Path, Transforms } from 'slate';
import { isListItem, isListNested, hasListChild, lastChildPath } from './helpers';
import type { NodeEntry, Ancestor, NodeMatch } from 'slate';

const isParagraph: NodeMatch<Ancestor> = (node) => {
  return Element.isElement(node) && node.type === 'paragraph';
};

function isLastChild(editor: Editor, at: Path) {
  const parentPath = Path.parent(at);
  const parent = Node.get(editor, parentPath) as Ancestor;
  return parent.children.length - 1 === at.at(-1);
}

function moveListItemUpFromNestedList(editor: Editor, listItemEntry: NodeEntry<Ancestor>) {
  const [listItem, listItemPath] = listItemEntry;

  const notLastChild = !isLastChild(editor, listItemPath);

  Transforms.liftNodes(editor, {
    at: listItemPath,
  });

  const liftedListItemEntry = Editor.above(editor, {
    match: isListItem,
  });
  if (liftedListItemEntry) {
    const [, liftedListItemPath] = liftedListItemEntry;

    // If li has next siblings, we need to move them.
    if (notLastChild) {
      const nextSplitListPath = Path.next(liftedListItemPath);
      const toPath = Path.next(lastChildPath(liftedListItemEntry));
      Transforms.moveNodes(editor, {
        at: nextSplitListPath,
        to: toPath,
      });

      // Move next siblings to li sublist.
      if (hasListChild(listItem)) {
        Transforms.mergeNodes(editor, {
          at: toPath,
        });
      }
    }

    // Move li one level up: next to the li parent.
    Transforms.liftNodes(editor, {
      at: liftedListItemPath,
    });
  }
}

export default function moveListItemUp(editor: Editor, listItemEntry: NodeEntry<Ancestor>) {
  const [listItem, listItemPath] = listItemEntry;

  if (isListNested(editor, listItemPath)) {
    moveListItemUpFromNestedList(editor, listItemEntry);
    return;
  }

  const notLastChild = !isLastChild(editor, listItemPath);

  Transforms.liftNodes(editor, {
    at: listItemPath,
  });
  Transforms.unwrapNodes(editor, {
    match: isListItem,
  });

  if (hasListChild(listItem) && notLastChild) {
    const paragraphEntry = Editor.above(editor, {
      match: isParagraph,
    });
    if (paragraphEntry) {
      const [, paragraphPath] = paragraphEntry;
      const nextSplitListPath = Path.next(Path.next(paragraphPath));
      Transforms.mergeNodes(editor, {
        at: nextSplitListPath,
      });
    }
  }
}

import { Editor, Element, Path } from 'slate';
import type { NodeEntry, NodeMatch, Ancestor } from 'slate';

export const isListItem: NodeMatch<Ancestor> = (node) => {
  return Element.isElement(node) && node.type === 'listItem';
};

export function isListNested(editor: Editor, at: Path) {
  const listPath = Path.parent(at);
  const ancestorListItemEntry = Editor.above(editor, {
    match: isListItem,
    at: listPath,
  });
  return ancestorListItemEntry !== undefined;
}

export function hasListChild(listItem: Ancestor) {
  return listItem.children.some((child) => Element.isElement(child) && child.type === 'list');
}

export function lastChildPath(entry: NodeEntry<Ancestor>): Path {
  const [node, path] = entry;
  return path.concat(node.children.length - 1);
}

import { Element } from 'slate';
import type { NodeMatch, Ancestor } from 'slate';

export const isParagraph: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'paragraph';

export const isHeading: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'heading';

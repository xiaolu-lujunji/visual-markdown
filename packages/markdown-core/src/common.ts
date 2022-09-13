import { Element } from 'slate';
import type { NodeMatch, Ancestor } from 'slate';

export const isHeading: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'heading';

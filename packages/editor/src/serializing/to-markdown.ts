import { unified } from 'unified';
import { map } from 'unist-util-map';
import omit from 'lodash/omit';
import { toMarkdown as toMarkdownBase } from 'mdast-util-to-markdown';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import type { Descendant } from 'slate';

const slateCompile: Plugin<void[], any, Root> = function slateCompile() {
  this.Compiler = function Compiler(tree: Root) {
    // @ts-ignore
    return map(tree, (node) => {
      switch (node.type) {
        case 'inlineCode':
          return { type: 'inlineCode', value: node.text };
        case 'thematicBreak':
        case 'html':
        case 'code':
          return omit(node, 'children');
        case 'paragraph':
        case 'heading':
        case 'blockquote':
        case 'list':
        case 'listItem':
        case 'link':
        default:
          if (node.text !== undefined) {
            let newNode = { type: 'text', value: node.text };
            if (node.emphasis) {
              newNode = { type: 'emphasis', children: [newNode] };
            }
            if (node.strong) {
              newNode = { type: 'strong', children: [newNode] };
            }
            return newNode;
          }
          return node;
      }
    });
  };
};

const processor = unified().use(slateCompile);

export default function toMarkdown(tree: { type: 'root'; children: Descendant[] }) {
  const newTree = processor.stringify(tree);
  // return newTree;
  return toMarkdownBase(newTree);
}

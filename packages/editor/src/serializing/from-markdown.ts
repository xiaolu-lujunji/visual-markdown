import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { map } from 'unist-util-map';
import omit from 'lodash/omit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import type { Descendant } from 'slate';

const slateCompile: Plugin<void[], Root, any> = function slateCompile() {
  this.Compiler = function Compiler(tree: Root) {
    // @ts-ignore
    return map(tree, (node) => {
      switch (node.type) {
        case 'text':
          return { text: node.value };
        case 'emphasis':
        case 'strong':
          const newNode = { text: node.children[0].value, [node.type]: true };
          delete node.children;
          return newNode;
        case 'inlineCode':
          return { text: node.value, inlineCode: true };
        case 'thematicBreak':
        case 'html':
        case 'code':
          return { ...omit(node, 'position'), children: [{ text: '' }] };
        case 'paragraph':
        case 'heading':
        case 'blockquote':
        case 'list':
        case 'listItem':
        case 'link':
        default:
          return omit(node, 'position');
      }
    });
  };
};

const processor = unified().use(remarkParse).use(slateCompile);

export default function fromMarkdown(markdown: string): Descendant[] {
  const vFile = processor.processSync(markdown);
  if (vFile.result.children.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  return vFile.result.children;
}

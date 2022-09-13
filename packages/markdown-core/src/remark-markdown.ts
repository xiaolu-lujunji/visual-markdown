import remarkParse from 'remark-parse';
import { map } from 'unist-util-map';
import omit from 'lodash/omit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

const remarkSlate: Plugin<void[], Root, Root> = function remarkSlate() {
  this.Compiler = function Compiler(tree: Root) {
    // @ts-ignore
    return map(tree, (node) => {
      switch (node.type) {
        case 'text':
          return { text: node.value };
        case 'thematicBreak':
          return { type: node.type, children: [{ text: '' }] };
        case 'paragraph':
        case 'heading':
        case 'blockquote':
        default:
          return omit(node, 'position');
      }
    });
  };
};

const remarkMarkdown = [remarkParse, remarkSlate];

export default remarkMarkdown;

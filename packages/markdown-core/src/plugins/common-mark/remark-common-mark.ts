import remarkParse from 'remark-parse';
import { map } from 'unist-util-map';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

const remarkSlate: Plugin<void[], Root, Root> = function remarkSlate() {
  this.Compiler = function Compiler(tree: Root) {
    // @ts-ignore
    return map(tree, (node) => {
      switch (node.type) {
        case 'text':
          return { text: node.value };
        case 'paragraph':
          return { type: node.type };
        case 'heading':
          return { type: node.type, depth: node.depth };
        default:
          return node;
      }
    });
  };
};

const remarkCommonMark = [remarkParse, remarkSlate];

export default remarkCommonMark;

import type { Content, PhrasingContent, Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import type { Descendant } from "slate";
import type { Plugin } from "unified";
import { unified } from "unified";
import { createParagraph } from "../common";
import {
  Blockquote,
  Code,
  Heading,
  HTML,
  Image,
  Link,
  List,
  ListItem,
  Paragraph,
  Text,
  ThematicBreak,
} from "../specs/common-mark";
import { Table, TableCell, TableRow } from "../specs/github-flavored-markdown";
import remarkEmoji from "./plugins/emoji";

const remarkSlate: Plugin = function () {
  function compile(
    node: Content | PhrasingContent
  ):
    | Paragraph
    | Heading
    | Text
    | ThematicBreak
    | Blockquote
    | List
    | ListItem
    | HTML
    | Code
    | Link
    | Image
    | Table
    | TableRow
    | TableCell {
    switch (node.type) {
      case "text":
        return { text: node.value } as Text;
      case "paragraph":
        return {
          type: node.type,
          children: node.children.map((child) => compile(child)),
        } as Paragraph;
      case "heading":
        return {
          type: node.type,
          depth: node.depth,
          children: node.children.map((child) => compile(child)),
        } as Heading;
      case "thematicBreak":
        return {
          type: node.type,
          children: [{ text: "" }],
        } as ThematicBreak;
      case "blockquote":
        return {
          type: node.type,
          children: node.children.map((child) => compile(child)),
        } as Blockquote;
      case "list":
        return {
          type: node.type,
          ordered: node.ordered ?? undefined,
          start: node.start,
          spread: node.spread,
          children: node.children.map((child) => compile(child)),
        } as List;
      case "listItem":
        return {
          type: node.type,
          spread: node.spread,
          children: node.children.map((child) => compile(child)),
        } as ListItem;
      case "html":
        return {
          type: node.type,
          value: node.value,
          children: [{ text: "" }],
        } as HTML;
      case "code":
        return {
          type: node.type,
          lang: node.lang ?? undefined,
          meta: node.meta ?? undefined,
          children: [{ text: node.value }],
        };
      case "strong":
        return {
          type: "strong",
          text: node.children[0].value,
        };
      case "inlineCode":
        return {
          type: node.type,
          text: node.value,
        };
      case "link":
        return {
          type: node.type,
          url: node.url,
          title: node.title,
          children: node.children.map((child) => compile(child)),
        } as Link;
      case "image":
        return {
          type: node.type,
          url: node.url,
          title: node.url,
          alt: node.alt,
          children: [{ text: "" }],
        } as Image;
      case "table":
        return {
          type: node.type,
          align: node.align ?? undefined,
          children: node.children.map((child) => compile(child)),
        } as Table;
      case "tableRow":
        return {
          type: node.type,
          children: node.children.map((child) => compile(child)),
        } as TableRow;
      case "tableCell":
        return {
          type: node.type,
          children: node.children.map((child) => compile(child)),
        } as TableCell;
      default:
        return createParagraph(`Unknown type ${node.type}`);
    }
  }

  this.Compiler = function (root: Root) {
    return root.children.map((child) => compile(child));
  };
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkEmoji)
  .use(remarkSlate);

export default function deserialize(text: string) {
  const tree = processor.processSync(text);
  const value = tree.result as Descendant[];
  if (value.length === 0) return [createParagraph("")];
  return value;
}

import type { BaseEditor } from "slate";
import type { ReactEditor, RenderElementProps } from "slate-react";
import { DefaultElement } from "slate-react";
import BlockquoteElement from "./elements/blockquote";
import CodeElement from "./elements/code";
import HeadingElement from "./elements/heading";
import HTMLElement from "./elements/html";
import ImageElement from "./elements/image";
import LinkElement from "./elements/link";
import ListElement from "./elements/list";
import ListItemElement from "./elements/list-item";
import ParagraphElement from "./elements/paragraph";
import TableElement, {
  TableCell as TableCellElement,
  TableRow as TableRowElement,
} from "./elements/table";
import ThematicBreakElement from "./elements/thematic-break";
import type {
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
} from "./specs/common-mark";
import { Table, TableCell, TableRow } from "./specs/github-flavored-markdown";

type Element =
  | Paragraph
  | Heading
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
  | TableCell;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Element;
    Text: Text;
  }
}

export default function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case "paragraph":
      return <ParagraphElement {...props} />;
    case "heading":
      return <HeadingElement {...props} />;
    case "thematicBreak":
      return <ThematicBreakElement {...props} />;
    case "blockquote":
      return <BlockquoteElement {...props} />;
    case "list":
      return <ListElement {...props} />;
    case "listItem":
      return <ListItemElement {...props} />;
    case "html":
      return <HTMLElement {...props} />;
    case "code":
      return <CodeElement {...props} />;
    case "link":
      return <LinkElement {...props} />;
    case "image":
      return <ImageElement {...props} />;
    case "table":
      return <TableElement {...props} />;
    case "tableRow":
      return <TableRowElement {...props} />;
    case "tableCell":
      return <TableCellElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

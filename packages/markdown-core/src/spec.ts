import type { Parent as UnistParent, Literal as UnistLiteral, Node } from 'unist';

export type AlignType = 'left' | 'right' | 'center' | null;

export type ReferenceType = 'shortcut' | 'collapsed' | 'full';

/**
 * This map registers all node types that may be used where markdown block content is accepted.
 *
 * These types are accepted inside block quotes, list items, footnotes, and roots.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface BlockContentMap {
 *     // Allow using math nodes defined by `remark-math`.
 *     math: Math;
 *   }
 * }
 */
export interface BlockContentMap {
  paragraph: Paragraph;
  heading: Heading;
  thematicbreak: ThematicBreak;
  blockquote: Blockquote;
  list: List;
  table: Table;
  html: HTML;
  code: Code;
}

/**
 * This map registers all frontmatter node types.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface FrontmatterContentMap {
 *     // Allow using toml nodes defined by `remark-frontmatter`.
 *     toml: TOML;
 *   }
 * }
 */
export interface FrontmatterContentMap {
  yaml: YAML;
}

/**
 * This map registers all node definition types.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface DefinitionContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface DefinitionContentMap {
  definition: Definition;
  footnoteDefinition: FootnoteDefinition;
}

/**
 * This map registers all node types that are acceptable in a static phrasing context.
 *
 * This interface can be augmented to register custom node types in a phrasing context, including links and link
 * references.
 *
 * @example
 * declare module 'mdast' {
 *   interface StaticPhrasingContentMap {
 *     mdxJsxTextElement: MDXJSXTextElement;
 *   }
 * }
 */
export interface StaticPhrasingContentMap {
  text: Text;
  delete: Delete;
  html: HTML;
  break: Break;
  image: Image;
  imagereference: ImageReference;
  footnote: Footnote;
  footnotereference: FootnoteReference;
}

/**
 * This map registers all node types that are acceptable in a (interactive) phrasing context (so not in links).
 *
 * This interface can be augmented to register custom node types in a phrasing context, excluding links and link
 * references.
 *
 * @example
 * declare module 'mdast' {
 *   interface PhrasingContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface PhrasingContentMap extends StaticPhrasingContentMap {
  link: Link;
  linkReference: LinkReference;
}

/**
 * This map registers all node types that are acceptable inside lists.
 *
 * This interface can be augmented to register custom node types that are acceptable inside lists.
 *
 * @example
 * declare module 'mdast' {
 *   interface ListContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface ListContentMap {
  listItem: ListItem;
}

/**
 * This map registers all node types that are acceptable inside tables (not table cells).
 *
 * This interface can be augmented to register custom node types that are acceptable inside tables.
 *
 * @example
 * declare module 'mdast' {
 *   interface TableContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface TableContentMap {
  tableRow: TableRow;
}

/**
 * This map registers all node types that are acceptable inside tables rows (not table cells).
 *
 * This interface can be augmented to register custom node types that are acceptable inside table rows.
 *
 * @example
 * declare module 'mdast' {
 *   interface RowContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface RowContentMap {
  tableCell: TableCell;
}

export type Content = TopLevelContent | ListContent | TableContent | RowContent | PhrasingContent;

export type TopLevelContent = BlockContent | FrontmatterContent | DefinitionContent;

export type BlockContent = BlockContentMap[keyof BlockContentMap];

export type FrontmatterContent = FrontmatterContentMap[keyof FrontmatterContentMap];

export type DefinitionContent = DefinitionContentMap[keyof DefinitionContentMap];

export type ListContent = ListContentMap[keyof ListContentMap];

export type TableContent = TableContentMap[keyof TableContentMap];

export type RowContent = RowContentMap[keyof RowContentMap];

export type PhrasingContent = PhrasingContentMap[keyof PhrasingContentMap];

export type StaticPhrasingContent = StaticPhrasingContentMap[keyof StaticPhrasingContentMap];

export interface Literal extends UnistLiteral {
  value: string;
}

export interface Root {
  type: 'root';
}

export interface Paragraph {
  type: 'paragraph';
  children: PhrasingContent[];
}

export interface Heading {
  type: 'heading';
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: PhrasingContent[];
}

export interface ThematicBreak {
  type: 'thematicBreak';
  children: [{ text: '' }];
}

export interface Blockquote {
  type: 'blockquote';
  children: Array<BlockContent | DefinitionContent>;
}

export interface List {
  type: 'list';
  ordered?: boolean | null | undefined;
  start?: number | null | undefined;
  spread?: boolean | null | undefined;
  children: ListContent[];
}

export interface ListItem {
  type: 'listItem';
  checked?: boolean | null | undefined;
  spread?: boolean | null | undefined;
  children: Array<BlockContent | DefinitionContent>;
}

export interface Table {
  type: 'table';
  align?: AlignType[] | null | undefined;
  children: TableContent[];
}

export interface TableRow {
  type: 'tableRow';
  children: RowContent[];
}

export interface TableCell {
  type: 'tableCell';
  children: PhrasingContent[];
}

export interface HTML extends Literal {
  type: 'html';
  autoFocus?: boolean;
  children: [{ text: '' }];
}

export interface Code extends Literal {
  type: 'code';
  lang?: string | null | undefined;
  meta?: string | null | undefined;
  autoFocus?: boolean;
  children: [{ text: '' }];
}

export interface YAML extends Literal {
  type: 'yaml';
}

export interface Definition extends Node, Association, Resource {
  type: 'definition';
}

export interface FootnoteDefinition extends Association {
  type: 'footnoteDefinition';
  children: Array<BlockContent | DefinitionContent>;
}

export interface Text {
  emphasis?: boolean;
  strong?: boolean;
  inlineCode?: boolean;
  text: string;
}

export interface Delete {
  type: 'delete';
  children: PhrasingContent[];
}

export interface Break extends Node {
  type: 'break';
}

export interface Link extends Resource {
  type: 'link';
  children: StaticPhrasingContent[];
}

export interface Image extends Node, Resource, Alternative {
  type: 'image';
}

export interface LinkReference extends Reference {
  type: 'linkReference';
  children: StaticPhrasingContent[];
}

export interface ImageReference extends Node, Reference, Alternative {
  type: 'imageReference';
}

export interface Footnote {
  type: 'footnote';
  children: PhrasingContent[];
}

export interface FootnoteReference extends Node, Association {
  type: 'footnoteReference';
}

// Mixin
export interface Resource {
  url: string;
  title?: string | null | undefined;
}

export interface Association {
  identifier: string;
  label?: string | null | undefined;
}

export interface Reference extends Association {
  referenceType: ReferenceType;
}

export interface Alternative {
  alt?: string | null | undefined;
}

export interface Void {
  children: [{ text: "" }];
}

export interface Text {
  type?: "strong" | "inlineCode";
  text: string;
}

export interface Paragraph {
  type: "paragraph";
  children: PhrasingContent[];
}

export interface Heading {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: PhrasingContent[];
}

export interface ThematicBreak extends Void {
  type: "thematicBreak";
}

export interface Blockquote {
  type: "blockquote";
  children: FlowContent[];
}

export interface List {
  type: "list";
  ordered: boolean;
  start?: number;
  spread: boolean;
  children: ListItem[];
}

export interface ListItem {
  type: "listItem";
  spread: boolean;
  children: FlowContent[];
}

export interface HTML extends Void {
  type: "html";
  value: string;
}

export interface Code {
  type: "code";
  lang?: string;
  meta?: string;
  children: [{ text: string }];
}

export interface Link extends Resource {
  type: "link";
  children: StaticPhrasingContent[];
}

export interface Image extends Resource, Alternative, Void {
  type: "image";
}

export interface Resource {
  url: string;
  title: string;
}

export interface Alternative {
  alt: string;
}

export type StaticPhrasingContent =
  // | Break
  // | Emphasis
  | HTML
  // | Image
  // | ImageReference
  // | InlineCode
  // | Strong
  | Text;

export type PhrasingContent = Text;

export type FlowContent = Blockquote | Heading | ThematicBreak | Paragraph;

import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type {
  Text,
  Paragraph,
  Heading,
  ThematicBreak,
  Blockquote,
  List,
  ListItem,
  HTML,
  Code,
  Link,
} from './spec';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element:
      | Paragraph
      | Heading
      | ThematicBreak
      | Blockquote
      | List
      | ListItem
      | HTML
      | Code
      | Link;
    Text: Text;
  }
}

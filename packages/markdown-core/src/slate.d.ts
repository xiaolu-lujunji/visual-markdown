import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Paragraph, Heading, ThematicBreak, Blockquote } from './spec';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Paragraph | Heading | ThematicBreak | Blockquote;
    Text: Text;
  }
}

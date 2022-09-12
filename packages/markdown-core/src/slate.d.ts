import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { Paragraph, Heading } from './spec';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Paragraph | Heading;
    Text: Text;
  }
}

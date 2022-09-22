import { Slate } from 'slate-react';
import Toolbar from './toolbar';
import Editable from './editable';
import type { Descendant } from 'slate';
import type { ReactEditor } from 'slate-react';

export interface EditorProps {
  editor: ReactEditor;
  value: Descendant[];
  onChange?: (value: Descendant[]) => void;
}

export default function Editor(props: EditorProps) {
  console.log('render editor');
  const { editor, value, onChange } = props;

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar />
      <Editable />
    </Slate>
  );
}

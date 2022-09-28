import type { ReactEditor } from 'slate-react';

export default function withLink(editor: ReactEditor) {
  const { isInline } = editor;

  editor.isInline = (element) => element.type === 'link' || isInline(element);

  return editor;
}

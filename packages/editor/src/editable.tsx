import { useCallback } from 'react';
import { Editable as EditableBase, useSlateStatic } from 'slate-react';
import renderBaseElement from './rendering/render-element';
import renderLeaf from './rendering/render-leaf';
import { keyDownHeading } from './plugins/with-heading';
import { keyDownThematicBreak } from './plugins/with-thematic-break';
import { keyDownBlockquote } from './plugins/with-blockquote';
import { keyDownList } from './plugins/with-list';
import { keyDownCode } from './plugins/with-code';
import type { RenderElementProps } from 'slate-react';

export interface EditableProps {
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
}

export default function Editable(props: EditableProps) {
  const editor = useSlateStatic();

  const renderElement = useCallback(
    (renderElementProps: RenderElementProps) => {
      const customElement = props.renderElement?.(renderElementProps);
      if (customElement !== undefined) return customElement;
      return renderBaseElement(renderElementProps);
    },
    [props.renderElement],
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
    if (keyDownHeading(editor, event)) return;
    if (keyDownThematicBreak(editor, event)) return;
    if (keyDownBlockquote(editor, event)) return;
    if (keyDownList(editor, event)) return;
    if (keyDownCode(editor, event)) return;
  }, []);

  console.log('render editable');

  return (
    <EditableBase renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={handleKeyDown} />
  );
}

import React from 'react';
import { Editable as EditableBase, DefaultElement } from 'slate-react';
import type { RenderElementProps } from 'slate-react';

export default function Editable() {
  const renderElement = React.useCallback((props: RenderElementProps) => {
    const { element, attributes, children } = props;
    switch (element.type) {
      case 'paragraph':
        return <p {...props} />;
      case 'heading':
        return React.createElement(`h${element.depth}`, attributes, children);
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return <EditableBase renderElement={renderElement} />;
}

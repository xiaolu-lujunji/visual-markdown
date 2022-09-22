import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { Link as LinkSpec } from '../spec';
import { OpenLinkContext } from '../editable';

export default function Link(props: RenderElementProps) {
  const { element, attributes, children } = props;
  const { url, title } = element as LinkSpec;

  const openLinkRef = React.useContext(OpenLinkContext);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.ctrlKey) {
      openLinkRef.current?.(url);
    }
  };

  return (
    <a url={url} title={title} {...attributes} onClick={handleClick}>
      {children}
    </a>
  );
}

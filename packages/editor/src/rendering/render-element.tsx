import { DefaultElement } from 'slate-react';
import Heading from './elements/heading';
import HTML from './elements/html';
import Code from './elements/code';
import { createElement } from 'react';
import type { RenderElementProps } from 'slate-react';
import Image from './elements/image';

export default function renderElement(props: RenderElementProps) {
  const { attributes, element, children } = props;

  switch (element.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'heading':
      return <Heading {...props} />;
    case 'thematicBreak':
      return (
        <div {...attributes} contentEditable={false}>
          {children}
          <hr />
        </div>
      );
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'list':
      return createElement(
        element.ordered ? 'ol' : 'ul',
        { ...attributes, start: element.start },
        children,
      );
    case 'listItem':
      return <li {...attributes}>{children}</li>;
    case 'html':
      return <HTML {...props} />;
    case 'code':
      return <Code {...props} />;
    case 'link':
      return (
        <a {...attributes} href={element.url} title={element.title}>
          {children}
        </a>
      );
    case 'image':
      return <Image {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

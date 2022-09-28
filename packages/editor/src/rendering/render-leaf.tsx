import type { RenderLeafProps } from 'slate-react';

export default function renderLeaf(props: RenderLeafProps) {
  const { leaf, attributes, children } = props;
  const { emphasis, strong, inlineCode } = leaf;

  const Component = inlineCode ? 'code' : 'span';

  return (
    <Component
      {...attributes}
      style={{
        fontStyle: emphasis ? 'italic' : 'normal',
        fontWeight: strong ? 'bold' : 'normal',
      }}
    >
      {children}
    </Component>
  );
}

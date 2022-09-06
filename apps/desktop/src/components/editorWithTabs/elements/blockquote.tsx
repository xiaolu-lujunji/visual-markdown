import type { RenderElementProps } from "slate-react";

export default function Blockquote(props: RenderElementProps) {
  return <blockquote {...props.attributes}>{props.children}</blockquote>;
}

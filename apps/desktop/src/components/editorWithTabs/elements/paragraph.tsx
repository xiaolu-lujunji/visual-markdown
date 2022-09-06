import type { RenderElementProps } from "slate-react";

export default function Paragraph(props: RenderElementProps) {
  return <p {...props.attributes}>{props.children}</p>;
}

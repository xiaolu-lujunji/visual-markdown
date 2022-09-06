import type { RenderElementProps } from "slate-react";

export default function ListItem(props: RenderElementProps) {
  return <li {...props.attributes}>{props.children}</li>;
}

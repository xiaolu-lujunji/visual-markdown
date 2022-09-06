import { RenderLeafProps } from "slate-react";

export default function renderLeaf(props: RenderLeafProps) {
  const { type } = props.leaf;
  switch (type) {
    case "strong":
      return <strong {...props.attributes}>{props.children}</strong>;
    case "inlineCode":
      return <code {...props.attributes}>{props.children}</code>;
    default:
      return (
        <span {...props.attributes} {...props.leaf.props}>
          {props.children}
        </span>
      );
  }
}

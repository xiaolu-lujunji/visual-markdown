import type { RenderElementProps } from "slate-react";
import type { Link as LinkSpec } from "../specs/common-mark";

export default function Link(props: RenderElementProps) {
  const { title, url } = props.element as LinkSpec;
  return (
    <a {...props.attributes} title={title} href={url}>
      {props.children}
    </a>
  );
}

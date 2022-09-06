import type { RenderElementProps } from "slate-react";
import { Image as ImageSpec } from "../specs/common-mark";
import { parseImageSrc } from "../utils";

export default function Image(props: RenderElementProps) {
  const { url, title, alt } = props.element as ImageSpec;
  return (
    <div {...props.attributes} contentEditable={false}>
      {props.children}
      <img title={title} src={parseImageSrc(url)} alt={alt} />
    </div>
  );
}

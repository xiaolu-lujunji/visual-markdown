import React from "react";
import type { RenderElementProps } from "slate-react";
import type { Heading as HeadingSpec } from "../specs/common-mark";

export default function Heading(props: RenderElementProps) {
  return React.createElement(
    `h${(props.element as HeadingSpec).depth}`,
    props.attributes,
    ...props.children
  );
}

import React from "react";
import type { RenderElementProps } from "slate-react";
import { List as ListSpec } from "../specs/common-mark";

export default function List(props: RenderElementProps) {
  const { ordered, start } = props.element as ListSpec;
  return React.createElement(
    ordered ? "ol" : "ul",
    {
      ...props.attributes,
      start,
    },
    ...props.children
  );
}

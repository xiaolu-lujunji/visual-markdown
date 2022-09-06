import type { RenderElementProps } from "slate-react";
import clsx from "clsx";
import { Code as CodeSpec } from "../specs/common-mark";

export default function Code(props: RenderElementProps) {
  return (
    <pre
      {...props.attributes}
      className={clsx(
        "prism-code",
        `language-${(props.element as CodeSpec).lang}`
      )}
    >
      <code>{props.children}</code>
    </pre>
  );
}

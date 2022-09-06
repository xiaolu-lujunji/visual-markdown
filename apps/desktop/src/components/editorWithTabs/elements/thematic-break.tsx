import type { RenderElementProps } from "slate-react";

export default function ThematicBreak(props: RenderElementProps) {
  return (
    <div {...props.attributes} contentEditable={false}>
      {props.children}
      <hr />
    </div>
  );
}

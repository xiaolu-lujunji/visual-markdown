import React from "react";
import { Editor, Path } from "slate";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

export default function Table(props: RenderElementProps) {
  const children = React.Children.toArray(props.children);
  const childrenInTableHead = children.slice(0, 1);
  const childrenInTableBody = children.slice(1);
  return (
    <table {...props.attributes}>
      <thead>{childrenInTableHead}</thead>
      <tbody>{childrenInTableBody}</tbody>
    </table>
  );
}

export function TableRow(props: RenderElementProps) {
  return <tr {...props.attributes}>{props.children}</tr>;
}

export function TableCell(props: RenderElementProps) {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, props.element);
  const row = path.at(-2);
  if (row === 0) return <th {...props.attributes}>{props.children}</th>;
  return <td {...props.attributes}>{props.children}</td>;
}

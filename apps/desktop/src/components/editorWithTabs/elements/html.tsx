import React from "react";
import { sanitize } from "dompurify";
import parse, {
  attributesToProps,
  HTMLReactParserOptions,
} from "html-react-parser";
import CodeMirror from "./common/code-mirror";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import type { HTML as HTMLSpec } from "../specs/common-mark";
import type { Text } from "@codemirror/state";
import { parseImageSrc } from "../utils";
import "./html.scss";
import { Transforms } from "slate";

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M4.708 5.578L2.061 8.224l2.647 2.646-.708.708-3-3V7.87l3-3 .708.708zm7-.708L11 5.578l2.647 2.646L11 10.87l.708.708 3-3V7.87l-3-3zM4.908 13l.894.448 5-10L9.908 3l-5 10z" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
    />
  </svg>
);

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    // TODO: why domNode instanceof Element is false?
    if (
      // domNode instanceof Element &&
      domNode.tagName === "img" &&
      domNode.attribs
    ) {
      const { src, ...other } = attributesToProps(domNode.attribs);
      return <img src={parseImageSrc(src)} {...other} />;
    }
  },
};

export default function HTML(props: RenderElementProps) {
  const { element } = props;

  const editor = useSlateStatic();
  const [preview, setPreview] = React.useState(true);

  const changeValue = (doc: Text) => {
    const value = doc.toString();
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { value }, { at: path });
  };

  if (!preview) {
    return (
      <div
        {...props.attributes}
        contentEditable={false}
        className="html-edit-root"
      >
        {props.children}
        <CheckIcon
          className="html-check-icon"
          onClick={() => setPreview(true)}
        />
        <CodeMirror
          doc={(element as HTMLSpec).value}
          lang="html"
          className="highlight"
          onDocChanged={changeValue}
        />
      </div>
    );
  }

  return (
    <div
      {...props.attributes}
      contentEditable={false}
      className="html-preview-root"
    >
      {props.children}
      <CodeIcon className="html-code-icon" onClick={() => setPreview(false)} />
      {parse(sanitize((props.element as HTMLSpec).value), options)}
    </div>
  );
}

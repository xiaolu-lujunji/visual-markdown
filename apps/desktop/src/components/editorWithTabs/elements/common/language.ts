import { html } from "@codemirror/lang-html";

const language = (lang?: string) => {
  switch (lang) {
    case "html":
      return html;
    default:
      return html;
  }
};

export default language;

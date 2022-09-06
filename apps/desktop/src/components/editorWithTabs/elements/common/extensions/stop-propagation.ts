import { EditorView } from "@codemirror/view";

const stopPropagation = EditorView.domEventHandlers({
  beforeinput: (event) => {
    event.stopPropagation();
    return false;
  },
  keydown: (event) => {
    event.stopPropagation();
    return false;
  },
});

export default stopPropagation;

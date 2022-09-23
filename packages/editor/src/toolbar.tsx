import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import CodeIcon from '@mui/icons-material/Code';
import { useRef, useEffect } from 'react';
import { useSlate, useFocused } from 'slate-react';
import { createPortal } from 'react-dom';
import { Editor, Transforms, Text, Range } from 'slate';
import type { ReactEditor } from 'slate-react';

type Format = 'emphasis' | 'strong' | 'inlineCode';

const toggleFormat = (editor: ReactEditor, format: Format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
};

const isFormatActive = (editor: ReactEditor, format: Format) => {
  const [match] = Editor.nodes(editor, {
    match: (node) => Text.isText(node) && node[format] === true,
    mode: 'all',
  });
  return !!match;
};

const FormatButton = (props: { format: Format; children?: React.ReactNode }) => {
  const { format, children } = props;
  const editor = useSlate();
  return (
    <ToggleButton
      value={format}
      selected={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {children}
    </ToggleButton>
  );
};

export default function Toolbar() {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.contentVisibility = 'visible';
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return createPortal(
    <Box
      ref={ref}
      sx={(theme) => ({
        position: 'absolute',
        contentVisibility: 'hidden',
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.short,
        }),
      })}
      // className={css`
      //   padding: 8px 7px 6px;
      //   position: absolute;
      //   z-index: 1;
      //   top: -10000px;
      //   left: -10000px;
      //   margin-top: -6px;
      //   opacity: 0;
      //   background-color: #222;
      //   border-radius: 4px;
      //   transition: opacity 0.75s;
      // `}
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <FormatButton format="strong">
        <FormatBoldIcon />
      </FormatButton>
      <FormatButton format="emphasis">
        <FormatItalicIcon />
      </FormatButton>
      <FormatButton format="inlineCode">
        <CodeIcon />
      </FormatButton>
    </Box>,
    document.body,
  );
}

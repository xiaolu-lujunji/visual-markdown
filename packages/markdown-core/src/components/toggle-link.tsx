import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import Popover from '@mui/material/Popover';
import Input from '@mui/material/Input';
import LinkIcon from '@mui/icons-material/Link';
import { Editor, Element, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

const isLinkActive = (editor: BaseEditor & ReactEditor) => {
  const [match] = Editor.nodes(editor, {
    match: (node) => Element.isElement(node) && node.type === 'link',
  });
  return !!match;
};

export default function ToggleLink() {
  const editor = useSlateStatic();

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      input.current?.focus();
    }
  }, [open]);

  const anchor = React.useRef<HTMLButtonElement>(null);
  const input = React.useRef<HTMLInputElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    event,
  ) => {
    const url = event.currentTarget.value;
    if (event.key === 'Enter' && url) {
      setOpen(false);
      Transforms.wrapNodes(
        editor,
        { type: 'link', url },
        {
          split: true,
        },
      );
      // setTimeout(() => {
      //   ReactEditor.focus(editor);
      //   Transforms.wrapNodes(editor, { type: 'link', url }, {
      //     split: true
      //   });
      // }, 0);
    }
  };

  return (
    <>
      <ToggleButton
        ref={anchor}
        value="link"
        selected={isLinkActive(editor)}
        onChange={() => setOpen(!open)}
      >
        <LinkIcon />
      </ToggleButton>
      <Popover
        open={open}
        anchorEl={anchor.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        disableRestoreFocus
      >
        <Input inputRef={input} placeholder="Paste link" onKeyDown={handleKeyDown} />
      </Popover>
    </>
  );
}

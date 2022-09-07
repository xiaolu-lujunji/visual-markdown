import Tooltip from '@mui/material/Tooltip';
import { open } from 'api/shell';
import type { RenderElementProps } from 'slate-react';
import type { Link as LinkSpec } from '../specs/common-mark';

export default function Link(props: RenderElementProps) {
  const { title, url } = props.element as LinkSpec;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.ctrlKey) {
      open(url);
    }
  };

  return (
    <Tooltip {...props.attributes} title={url}>
      <a title={title} href={url} onClick={handleClick}>
        {props.children}
      </a>
    </Tooltip>
  );
}

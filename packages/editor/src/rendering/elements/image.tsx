import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useRef, useState } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import type { RenderElementProps } from 'slate-react';
import type { Image as ImageSpec } from '../../spec';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Image(props: RenderElementProps) {
  const { attributes, element, children } = props;

  const { url, alt } = element as ImageSpec;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [value, setValue] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useSlateStatic();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const embedImage = () => {
    const url = inputRef.current?.value;
    if (url) {
      Transforms.setNodes(
        editor,
        { url },
        {
          at: ReactEditor.findPath(editor, element),
        },
      );
    }
  };

  if (url === '') {
    return (
      <div {...attributes} contentEditable={false}>
        <Button variant="contained" onClick={handleClick}>
          Open Popover
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Upload" {...a11yProps(0)} />
              <Tab label="Embed link" {...a11yProps(1)} />
              <Tab label="Unsplash" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField
                inputRef={inputRef}
                id="outlined-basic"
                label="Paste the image link..."
                variant="outlined"
              />
              <Button variant="contained" onClick={embedImage}>
                Embed image
              </Button>
              <Typography variant="caption">Works with any image from the web</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Popover>
      </div>
    );
  }

  return (
    <div {...attributes} contentEditable={false}>
      {children}
      <img src={url} alt={alt} />
    </div>
  );
}

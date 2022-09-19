import { useSelected } from 'slate-react';
import {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  HeadingFour,
  HeadingFive,
  HeadingSix,
} from '../components/icons';
import styled from '@mui/material/styles/styled';
import type { RenderElementProps } from 'slate-react';
import type { Heading as HeadingSpec } from '../spec';

const HEADING_ICONS = [HeadingOne, HeadingTwo, HeadingThree, HeadingFour, HeadingFive, HeadingSix];

const HeadingRoot = styled('div')({
  position: 'relative',
});

const StartIconRoot = styled('div')({
  position: 'absolute',
  top: 'calc(50% - 10px)',
  left: -(20 + 5),
  display: 'flex',
});

export default function Heading(props: RenderElementProps) {
  const { attributes, element, children } = props;

  const as = `h${(element as HeadingSpec).depth}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const Icon = HEADING_ICONS[(element as HeadingSpec).depth - 1];

  const selected = useSelected();

  return (
    <HeadingRoot as={as} {...attributes}>
      <StartIconRoot
        contentEditable={false}
        sx={{
          contentVisibility: selected ? 'visible' : 'hidden',
        }}
      >
        <Icon viewBox="0 0 1024 1024" fontSize="small" />
      </StartIconRoot>
      {children}
    </HeadingRoot>
  );
}

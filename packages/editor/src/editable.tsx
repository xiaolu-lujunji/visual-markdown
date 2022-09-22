import React from 'react';
import { Range, Editor, Element, Node, Transforms, Path, Point } from 'slate';
import { Editable as EditableBase, DefaultElement, useSlateStatic } from 'slate-react';
import HeadingElement from './elements/heading';
import HTML from './elements/html';
import Code from './elements/code';
import Link from './elements/link';
import styled from '@mui/material/styles/styled';
import isHotkey from 'is-hotkey';
import { isHeading } from './common';
import type { NodeMatch, Ancestor } from 'slate';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import type { Paragraph, Heading } from './spec';

const HEADING_REG = /^ {0,3}(#{1,6})$/;
const THEMATIC_BREAK_REG = /^ {0,3}((?:-[\t ]*){2,}|(?:_[ \t]*){2,}|(?:\*[ \t]*){2,})(?:\n+|$)/;
const BLOCKQUOTE_REG = /^( {0,3}>$)/;
const LIST_REG = /^ {0,3}(?:[*+-]|(\d{1,9})[.)])/;
const HTML_REG = /^<([a-zA-Z\d-]+)(?=\s|>)[^<>]*?>$/;
const CODE_REG = /^`{2,}$/;

const isSpace = isHotkey('space');
const isEnter = isHotkey('enter');
const isThematicBreakHotKey = (event: React.KeyboardEvent<HTMLDivElement>) =>
  event.key === '-' || event.key === '_' || event.key === '*';
const isBacktick = isHotkey('`');

const isParagraph: NodeMatch<Ancestor> = (node) =>
  Element.isElement(node) && node.type === 'paragraph';

const StyledEditableBase = styled(EditableBase)({
  padding: 45,
});

export const RewriteImageSrcContext =
  // @ts-ignore
  React.createContext<React.MutableRefObject<((src: string) => string) | undefined>>();

export const OpenLinkContext =
  // @ts-ignore
  React.createContext<React.MutableRefObject<((href: string) => string) | undefined>>();

export interface EditableProps {
  rewriteImageSrc?: (src: string) => string;
  openLink?: (href: string) => string;
}

export default function Editable(props: EditableProps) {
  const { rewriteImageSrc, openLink } = props;

  const rewriteImageSrcRef = React.useRef(rewriteImageSrc);
  rewriteImageSrcRef.current = rewriteImageSrc;

  const openLinkRef = React.useRef(openLink);
  openLinkRef.current = openLink;

  const editor = useSlateStatic();

  const renderElement = React.useCallback((props: RenderElementProps) => {
    const { element, attributes, children } = props;
    switch (element.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>;
      case 'heading':
        return <HeadingElement {...props} />;
      case 'thematicBreak':
        return (
          <div {...attributes} contentEditable={false}>
            {children}
            <hr />
          </div>
        );
      case 'blockquote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'list':
        return React.createElement(
          element.ordered ? 'ol' : 'ul',
          { ...attributes, start: element.start },
          children,
        );
      case 'listItem':
        return <li {...attributes}>{children}</li>;
      case 'html':
        return <HTML {...props} />;
      case 'code':
        return <Code {...props} />;
      case 'link':
        return <Link {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = React.useCallback((props: RenderLeafProps) => {
    const { leaf, attributes, children } = props;
    const { emphasis, strong, inlineCode } = leaf;

    const Component = inlineCode ? 'code' : 'span';

    return (
      <Component
        {...attributes}
        style={{
          fontStyle: emphasis ? 'italic' : 'normal',
          fontWeight: strong ? 'bold' : 'normal',
        }}
      >
        {children}
      </Component>
    );
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = React.useCallback((event) => {
    if (isSpace(event)) {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const paragraphEntry = Editor.above<Paragraph>(editor, {
          match: isParagraph,
        });
        if (paragraphEntry) {
          const [paragraph, paragraphPath] = paragraphEntry;
          const text = Node.string(paragraph);
          const searchHeadingResult = HEADING_REG.exec(text);
          if (searchHeadingResult) {
            event.preventDefault();
            const [, numberSigns] = searchHeadingResult;
            const depth = numberSigns.length as 1 | 2 | 3 | 4 | 5 | 6;
            Transforms.insertNodes(
              editor,
              { type: 'heading', depth, children: [{ text: '' }] },
              {
                at: paragraphPath,
              },
            );
            Transforms.removeNodes(editor, { at: Path.next(paragraphPath) });
            return;
          }
          const searchBlockquoteResult = BLOCKQUOTE_REG.exec(text);
          if (searchBlockquoteResult) {
            event.preventDefault();
            Transforms.insertNodes(
              editor,
              {
                type: 'blockquote',
                children: [{ type: 'paragraph', children: [{ text: '' }] }],
              },
              {
                at: paragraphPath,
              },
            );
            Transforms.removeNodes(editor, { at: Path.next(paragraphPath) });
            return;
          }
          const searchListResult = LIST_REG.exec(text);
          if (searchListResult) {
            event.preventDefault();
            const [, start] = searchListResult;
            const ordered = start !== undefined;
            Transforms.insertNodes(
              editor,
              {
                type: 'list',
                ordered,
                start: ordered ? window.parseInt(start, 10) : undefined,
                children: [
                  { type: 'listItem', children: [{ type: 'paragraph', children: [{ text: '' }] }] },
                ],
              },
              {
                at: paragraphPath,
              },
            );
            Transforms.removeNodes(editor, { at: Path.next(paragraphPath) });
            return;
          }
        }
      }
    } else if (isEnter(event)) {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const headingEntry = Editor.above<Heading>(editor, { match: isHeading });
        if (headingEntry) {
          const [, headingPath] = headingEntry;
          const end = Editor.end(editor, headingPath);
          if (Point.equals(editor.selection.anchor, end)) {
            event.preventDefault();
            Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
            return;
          }
        }

        const paragraphEntry = Editor.above<Paragraph>(editor, {
          match: isParagraph,
        });
        if (paragraphEntry) {
          const [paragraph, paragraphPath] = paragraphEntry;
          const text = Node.string(paragraph);
          const htmlSearchResult = HTML_REG.exec(text);
          if (htmlSearchResult) {
            event.preventDefault();
            const [, tag] = htmlSearchResult;
            Transforms.insertNodes(
              editor,
              {
                type: 'html',
                value: `<${tag}></${tag}>`,
                autoFocus: true,
                children: [{ text: '' }],
              },
              {
                at: paragraphPath,
              },
            );
            editor.deleteBackward('word');
          }
        }
      }
    } else if (isThematicBreakHotKey(event)) {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const paragraphEntry = Editor.above<Paragraph>(editor, { match: isParagraph });
        if (paragraphEntry) {
          const [paragraph, paragraphPath] = paragraphEntry;
          const text = Node.string(paragraph);
          const searchResult = THEMATIC_BREAK_REG.exec(text);
          if (searchResult) {
            event.preventDefault();
            Transforms.insertNodes(
              editor,
              { type: 'thematicBreak', children: [{ text: '' }] },
              {
                at: paragraphPath,
              },
            );
            editor.deleteBackward('word');
          }
        }
      }
    } else if (isBacktick(event)) {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const paragraphEntry = Editor.above<Paragraph>(editor, {
          match: isParagraph,
        });
        if (paragraphEntry) {
          const [paragraph, paragraphPath] = paragraphEntry;
          const text = Node.string(paragraph);
          const searchCodeResult = CODE_REG.exec(text);
          if (searchCodeResult) {
            event.preventDefault();
            Transforms.insertNodes(
              editor,
              { type: 'code', value: '', autoFocus: true, children: [{ text: '' }] },
              {
                at: paragraphPath,
              },
            );
            editor.deleteBackward('word');
            return;
          }
        }
      }
    }
  }, []);

  console.log('render editable');

  return (
    <RewriteImageSrcContext.Provider value={rewriteImageSrcRef}>
      <OpenLinkContext.Provider value={openLinkRef}>
        <StyledEditableBase
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
        />
      </OpenLinkContext.Provider>
    </RewriteImageSrcContext.Provider>
  );
}

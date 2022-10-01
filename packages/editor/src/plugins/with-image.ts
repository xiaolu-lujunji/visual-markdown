import { Editor, Element, Node, Text, Transforms } from 'slate';

const IMAGE_REG_EXP = /^\!\[(.*?)\]\((.*?)( "(.*?)")?\)$/;

export default function withImage(editor: Editor) {
  const { insertText } = editor;

  editor.insertText = (text) => {
    insertText(text);

    const paragraphEntry = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'paragraph',
    });
    if (paragraphEntry) {
      const [paragraph, paragraphPath] = paragraphEntry;
      const text = Node.string(paragraph);
      const searchResult = IMAGE_REG_EXP.exec(text);
      if (searchResult) {
        const [, alt, url, titleRaw, title] = searchResult;
        Transforms.removeNodes(editor, {
          at: paragraphPath,
        });
        Transforms.insertNodes(
          editor,
          [
            {
              type: 'image',
              url,
              alt,
              title,
              children: [{ text: '' }],
            },
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
          {
            at: paragraphPath,
          },
        );
      }
    }
  };

  return editor;
}

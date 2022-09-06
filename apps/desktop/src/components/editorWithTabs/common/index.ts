import type { Paragraph } from "../specs/common-mark";

export function createParagraph(text = ""): Paragraph {
  return { type: "paragraph", children: [{ text }] };
}

import Prism, { Token } from "prismjs";
import "prismjs/components/prism-bash";
import React from "react";
import { Element, Node, NodeEntry, Range } from "slate";

interface NormalizedToken {
  types: string[];
  content: string;
  empty?: boolean;
}

const newlineRe = /\r\n|\r|\n/;

// Empty lines need to contain a single empty token, denoted with { empty: true }
const normalizeEmptyLines = (line: NormalizedToken[]) => {
  if (line.length === 0) {
    line.push({
      types: ["plain"],
      content: "\n",
      empty: true,
    });
  } else if (line.length === 1 && line[0].content === "") {
    line[0].content = "\n";
    line[0].empty = true;
  }
};

const appendTypes = (types: string[], add: string[] | string): string[] => {
  const typesSize = types.length;
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types;
  }

  return types.concat(add);
};

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
const normalizeTokens = (
  tokens: Array<Token | string>
): NormalizedToken[][] => {
  const typeArrStack: string[][] = [[]];
  const tokenArrStack = [tokens];
  const tokenArrIndexStack = [0];
  const tokenArrSizeStack = [tokens.length];

  let i = 0;
  let stackIndex = 0;
  let currentLine: NormalizedToken[] = [];

  const acc = [currentLine];

  while (stackIndex > -1) {
    while (
      (i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]
    ) {
      let content: Token["content"];
      let types = typeArrStack[stackIndex];

      const tokenArr = tokenArrStack[stackIndex];
      const token = tokenArr[i];

      // Determine content and append type to types if necessary
      if (typeof token === "string") {
        types = stackIndex > 0 ? types : ["plain"];
        content = token;
      } else {
        types = appendTypes(types, token.type);
        if (token.alias) {
          types = appendTypes(types, token.alias);
        }

        content = token.content;
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== "string") {
        stackIndex++;
        typeArrStack.push(types);
        tokenArrStack.push(content);
        tokenArrIndexStack.push(0);
        tokenArrSizeStack.push(content.length);
        continue;
      }

      // Split by newlines
      // const splitByNewlines = content.split(newlineRe);
      // const newlineCount = splitByNewlines.length;

      // currentLine.push({ types, content: splitByNewlines[0] });

      // Create a new line for each string on a new line
      // for (let i = 1; i < newlineCount; i++) {
      //   normalizeEmptyLines(currentLine);
      //   acc.push((currentLine = []));
      //   currentLine.push({ types, content: splitByNewlines[i] });
      // }

      currentLine.push({ types, content });
      acc.push((currentLine = []));
    }

    // Decreate the stack depth
    stackIndex--;
    typeArrStack.pop();
    tokenArrStack.pop();
    tokenArrIndexStack.pop();
    tokenArrSizeStack.pop();
  }

  // normalizeEmptyLines(currentLine);
  return acc;
};

export default function decorate([node, path]: NodeEntry): (Range & {
  props: React.HTMLAttributes<HTMLSpanElement>;
})[] {
  if (Element.isElement(node) && node.type === "code") {
    const code = Node.string(node);
    let mixedTokens: (string | Prism.Token)[] = [code];
    if (node.lang !== undefined) {
      const grammar = Prism.languages[node.lang];
      if (grammar !== undefined) {
        mixedTokens = Prism.tokenize(code, grammar);
        const tokens = normalizeTokens(mixedTokens);

        const ranges: (Range & {
          props: React.HTMLAttributes<HTMLSpanElement>;
        })[] = [];

        let start = 0;

        for (const line of tokens) {
          for (const token of line) {
            const length = token.content.length;
            const end = start + length;

            ranges.push({
              props: {
                className: `token ${token.types.join(" ")}`,
              },
              anchor: { path, offset: start },
              focus: { path, offset: end },
            });

            start = end;
          }
        }

        return ranges;
      }
    }
  }
  return [];
}

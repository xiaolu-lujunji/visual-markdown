import { emoticon } from "emoticon";
import type { Root } from "mdast";
import emoji from "node-emoji";
import type { Plugin, Processor } from "unified";
import { visit } from "unist-util-visit";

const RE_EMOJI = /:\+1:|:-1:|:[\w-]+:/g;
const RE_SHORT = /[$@|*'",;.=:\-)([\]\\/<>038BOopPsSdDxXzZ]{2,5}/g;
const RE_UNDERSTORE = /_/g;

const DEFAULT_SETTINGS = {
  padSpaceAfter: false,
  emoticon: false,
};

interface RemarkEmojiOptions {
  /**
   * Adds an extra whitespace after emoji.
   * Useful when browser handle emojis with half character length and
   * the following character is hidden.
   *
   * @defaultValue false
   */
  padSpaceAfter?: boolean;
  /**
   * Whether to support emoticon shortcodes (e.g. :-) will be replaced by 😃)
   *
   * @defaultValue false
   */
  emoticon?: boolean;
}

const remarkEmoji: Plugin<[(RemarkEmojiOptions | undefined)?], Root, Root> =
  function remarkEmoji(options) {
    const settings = Object.assign({}, DEFAULT_SETTINGS, options);
    const pad = !!settings.padSpaceAfter;
    const emoticonEnable = !!settings.emoticon;

    function getEmojiByShortCode(match: string) {
      // find emoji by shortcode - full match or with-out last char as it could be from text e.g. :-),
      const iconFull = emoticon.find((e) => e.emoticons.includes(match)); // full match
      const iconPart = emoticon.find((e) =>
        e.emoticons.includes(match.slice(0, -1))
      ); // second search pattern
      const trimmedChar = iconPart ? match.slice(-1) : "";
      const addPad = pad ? " " : "";
      const icon = iconFull
        ? iconFull.emoji + addPad
        : iconPart && iconPart.emoji + addPad + trimmedChar;
      return icon || match;
    }

    function getEmoji(match: string) {
      let got = emoji.get(match);

      // Workaround for #19. :man-*: and :woman-*: are now :*_man: and :*_woman: on GitHub. node-emoji
      // does not support the new short codes. Convert new to old.
      // TODO: Remove this workaround when this PR is merged and shipped: https://github.com/omnidan/node-emoji/pull/112
      if (match.endsWith("_man:") && got === match) {
        // :foo_bar_man: -> man-foo-bar
        const old = "man-" + match.slice(1, -5).replace(RE_UNDERSTORE, "-");
        const s = emoji.get(old);
        if (s !== old) {
          got = s;
        }
      } else if (match.endsWith("_woman:") && got === match) {
        // :foo_bar_woman: -> woman-foo-bar
        const old = "woman-" + match.slice(1, -7).replace(RE_UNDERSTORE, "-");
        const s = emoji.get(old);
        if (s !== old) {
          got = s;
        }
      }

      if (pad && got !== match) {
        return got + " ";
      }
      return got;
    }

    function transformer(
      this: Processor<void, Root, void, void>,
      tree: Root
    ): void {
      visit(tree, "html", function (node) {
        node.value = node.value.replace(RE_EMOJI, getEmoji);
        if (emoticonEnable) {
          node.value = node.value.replace(RE_SHORT, getEmojiByShortCode);
        }
      });
    }

    return transformer;
  };

export default remarkEmoji;

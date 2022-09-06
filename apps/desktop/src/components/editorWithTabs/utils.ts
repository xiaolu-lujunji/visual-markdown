const IMAGE_EXT_REG = /\.(?:jpeg|jpg|png|gif|svg|webp)(?=\?|$)/i;
const URL_REG =
  /^http(s)?:\/\/([a-z0-9\-._~]+\.[a-z]{2,}|[0-9.]+|localhost|\[[a-f0-9.:]+\])(:[0-9]{1,5})?\/[\S]+/i;
const DATA_URL_REG =
  /^data:image\/[\w+-]+(;[\w-]+=[\w-]+|;base64)*,[a-zA-Z0-9+/]+={0,2}$/;

export function parseImageSrc(src: string, baseUrl: string = window.DIRNAME) {
  const imageExtension = IMAGE_EXT_REG.test(src);
  const isUrl =
    URL_REG.test(src) || (imageExtension && /^file:\/\/.+/.test(src));

  // Treat an URL with valid extension as image.
  if (imageExtension) {
    // NOTE: Check both "C:\" and "C:/" because we're using "file:///C:/".
    const isAbsoluteLocal = /^(?:\/|\\\\|[a-zA-Z]:\\|[a-zA-Z]:\/).+/.test(src);

    if (isUrl || (!isAbsoluteLocal && !baseUrl)) {
      if (!isUrl && !baseUrl) {
        console.warn('"baseUrl" is not defined!');
      }

      return src;
    } else {
      // Correct relative path on desktop. If we resolve a absolute path "path.resolve" doesn't do anything.
      // NOTE: We don't need to convert Windows styled path to UNIX style because Chromium handels this internal.
      return "file://" + require("path").resolve(baseUrl, src);
    }
  } else if (isUrl && !imageExtension) {
    // Assume it's a valid image and make a http request later
    return src;
  }

  // Data url
  if (DATA_URL_REG.test(src)) {
    return src;
  }

  // Url type is unknown
  return "";
}

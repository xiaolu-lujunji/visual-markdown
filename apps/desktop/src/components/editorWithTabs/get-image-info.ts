export const URL_REG =
  /^http(s)?:\/\/([a-z0-9\-._~]+\.[a-z]{2,}|[0-9.]+|localhost|\[[a-f0-9.:]+\])(:[0-9]{1,5})?\/[\S]+/i;

export const IMAGE_EXT_REG = /\.(?:jpeg|jpg|png|gif|svg|webp)(?=\?|$)/i;

export const DATA_URL_REG = /^data:image\/[\w+-]+(;[\w-]+=[\w-]+|;base64)*,[a-zA-Z0-9+/]+={0,2}$/;

/**
 * Return image information and correct the relative image path if needed.
 *
 * @param {string} src Image url
 * @param {string} baseUrl Base path; used on desktop to fix the relative image path.
 */
export const getImageInfo = (src, baseUrl = window.DIRNAME) => {
  const imageExtension = IMAGE_EXT_REG.test(src);
  const isUrl = URL_REG.test(src) || (imageExtension && /^file:\/\/.+/.test(src));

  // Treat an URL with valid extension as image.
  if (imageExtension) {
    // NOTE: Check both "C:\" and "C:/" because we're using "file:///C:/".
    const isAbsoluteLocal = /^(?:\/|\\\\|[a-zA-Z]:\\|[a-zA-Z]:\/).+/.test(src);

    if (isUrl || (!isAbsoluteLocal && !baseUrl)) {
      if (!isUrl && !baseUrl) {
        console.warn('"baseUrl" is not defined!');
      }

      return {
        isUnknownType: false,
        src,
      };
    } else {
      // Correct relative path on desktop. If we resolve a absolute path "path.resolve" doesn't do anything.
      // NOTE: We don't need to convert Windows styled path to UNIX style because Chromium handels this internal.
      return {
        isUnknownType: false,
        src: 'file://' + require('path').resolve(baseUrl, src),
      };
    }
  } else if (isUrl && !imageExtension) {
    // Assume it's a valid image and make a http request later
    return {
      isUnknownType: true,
      src,
    };
  }

  // Data url
  if (DATA_URL_REG.test(src)) {
    return {
      isUnknownType: false,
      src,
    };
  }

  // Url type is unknown
  return {
    isUnknownType: false,
    src: '',
  };
};

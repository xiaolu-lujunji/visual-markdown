// special character
const charachers = [
  '"',
  "&",
  "<",
  ">",
  " ",
  " ",
  " ",
  " ",
  "<",
  ">",
  "&",
  '"',
  "©",
  "®",
  "™",
  "×",
  "÷",
  " ",
  "¡",
  "¢",
  "£",
  "¤",
  "¥",
  "¦",
  "§",
  "¨",
  "©",
  "ª",
  "«",
  "¬",
  "­",
  "®",
  "¯",
  "°",
  "±",
  "²",
  "³",
  "´",
  "µ",
  "¶",
  "·",
  "¸",
  "¹",
  "º",
  "»",
  "¼",
  "½",
  "¾",
  "¿",
  "À",
  "Á",
  "Â",
  "Ã",
  "Ä",
  "Å",
  "Æ",
  "Ç",
  "È",
  "É",
  "Ê",
  "Ë",
  "Ì",
  "Í",
  "Î",
  "Ï",
  "Ð",
  "Ñ",
  "Ò",
  "Ó",
  "Ô",
  "Õ",
  "Ö",
  "×",
  "Ø",
  "Ù",
  "Ú",
  "Û",
  "Ü",
  "Ý",
  "Þ",
  "ß",
  "à",
  "á",
  "â",
  "ã",
  "ä",
  "å",
  "æ",
  "ç",
  "è",
  "é",
  "ê",
  "ë",
  "ì",
  "í",
  "î",
  "ï",
  "ð",
  "ñ",
  "ò",
  "ó",
  "ô",
  "õ",
  "ö",
  "÷",
  "ø",
  "ù",
  "ú",
  "û",
  "ü",
  "ý",
  "þ",
  "ÿ",
  "ƒ",
  "Α",
  "Β",
  "Γ",
  "Δ",
  "Ε",
  "Ζ",
  "Η",
  "Θ",
  "Ι",
  "Κ",
  "Λ",
  "Μ",
  "Ν",
  "Ξ",
  "Ο",
  "Π",
  "Ρ",
  "Σ",
  "Τ",
  "Υ",
  "Φ",
  "Χ",
  "Ψ",
  "Ω",
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "ζ",
  "η",
  "θ",
  "ι",
  "κ",
  "λ",
  "μ",
  "ν",
  "ξ",
  "ο",
  "π",
  "ρ",
  "ς",
  "σ",
  "τ",
  "υ",
  "φ",
  "χ",
  "ψ",
  "ω",
  "ϑ",
  "ϒ",
  "ϖ",
  "•",
  "…",
  "′",
  "″",
  "‾",
  "⁄",
  "℘",
  "ℑ",
  "ℜ",
  "™",
  "ℵ",
  "←",
  "↑",
  "→",
  "↓",
  "↔",
  "↵",
  "⇐",
  "⇑",
  "⇒",
  "⇓",
  "⇔",
  "∀",
  "∂",
  "∃",
  "∅",
  "∇",
  "∈",
  "∉",
  "∋",
  "∏",
  "∑",
  "−",
  "∗",
  "√",
  "∝",
  "∞",
  "∠",
  "∧",
  "∨",
  "∩",
  "∪",
  "∫",
  "∴",
  "∼",
  "≅",
  "≈",
  "≠",
  "≡",
  "≤",
  "≥",
  "⊂",
  "⊃",
  "⊄",
  "⊆",
  "⊇",
  "⊕",
  "⊗",
  "⊥",
  "⋅",
  "⌈",
  "⌉",
  "⌊",
  "⌋",
  "⟨",
  "⟩",
  "◊",
  "♠",
  "♣",
  "♥",
  "♦",
  '"',
  "&",
  "<",
  ">",
  "Œ",
  "œ",
  "Š",
  "š",
  "Ÿ",
  "ˆ",
  "˜",
  " ",
  " ",
  " ",
  "‌",
  "‍",
  "‎",
  "‏",
  "–",
  "—",
  "‘",
  "’",
  "‚",
  "“",
  "”",
  "„",
  "†",
  "‡",
  "‰",
  "‹",
  "›",
  "€",
];

export const escapeCharacters = [
  "&quot;",
  "&amp;",
  "&lt;",
  "&gt;",
  "&nbsp;",
  "&ensp;",
  "&emsp;",
  "&nbsp;",
  "&lt;",
  "&gt;",
  "&amp;",
  "&quot;",
  "&copy;",
  "&reg;",
  "&trade;",
  "&times;",
  "&divide;",
  "&nbsp;",
  "&iexcl;",
  "&cent;",
  "&pound;",
  "&curren;",
  "&yen;",
  "&brvbar;",
  "&sect;",
  "&uml;",
  "&copy;",
  "&ordf;",
  "&laquo;",
  "&not;",
  "&shy;",
  "&reg;",
  "&macr;",
  "&deg;",
  "&plusmn;",
  "&sup2;",
  "&sup3;",
  "&acute;",
  "&micro;",
  "&para;",
  "&middot;",
  "&cedil;",
  "&sup1;",
  "&ordm;",
  "&raquo;",
  "&frac14;",
  "&frac12;",
  "&frac34;",
  "&iquest;",
  "&Agrave;",
  "&Aacute;",
  "&Acirc;",
  "&Atilde;",
  "&Auml;",
  "&Aring;",
  "&AElig;",
  "&Ccedil;",
  "&Egrave;",
  "&Eacute;",
  "&Ecirc;",
  "&Euml;",
  "&Igrave;",
  "&Iacute;",
  "&Icirc;",
  "&Iuml;",
  "&ETH;",
  "&Ntilde;",
  "&Ograve;",
  "&Oacute;",
  "&Ocirc;",
  "&Otilde;",
  "&Ouml;",
  "&times;",
  "&Oslash;",
  "&Ugrave;",
  "&Uacute;",
  "&Ucirc;",
  "&Uuml;",
  "&Yacute;",
  "&THORN;",
  "&szlig;",
  "&agrave;",
  "&aacute;",
  "&acirc;",
  "&atilde;",
  "&auml;",
  "&aring;",
  "&aelig;",
  "&ccedil;",
  "&egrave;",
  "&eacute;",
  "&ecirc;",
  "&euml;",
  "&igrave;",
  "&iacute;",
  "&icirc;",
  "&iuml;",
  "&eth;",
  "&ntilde;",
  "&ograve;",
  "&oacute;",
  "&ocirc;",
  "&otilde;",
  "&ouml;",
  "&divide;",
  "&oslash;",
  "&ugrave;",
  "&uacute;",
  "&ucirc;",
  "&uuml;",
  "&yacute;",
  "&thorn;",
  "&yuml;",
  "&fnof;",
  "&Alpha;",
  "&Beta;",
  "&Gamma;",
  "&Delta;",
  "&Epsilon;",
  "&Zeta;",
  "&Eta;",
  "&Theta;",
  "&Iota;",
  "&Kappa;",
  "&Lambda;",
  "&Mu;",
  "&Nu;",
  "&Xi;",
  "&Omicron;",
  "&Pi;",
  "&Rho;",
  "&Sigma;",
  "&Tau;",
  "&Upsilon;",
  "&Phi;",
  "&Chi;",
  "&Psi;",
  "&Omega;",
  "&alpha;",
  "&beta;",
  "&gamma;",
  "&delta;",
  "&epsilon;",
  "&zeta;",
  "&eta;",
  "&theta;",
  "&iota;",
  "&kappa;",
  "&lambda;",
  "&mu;",
  "&nu;",
  "&xi;",
  "&omicron;",
  "&pi;",
  "&rho;",
  "&sigmaf;",
  "&sigma;",
  "&tau;",
  "&upsilon;",
  "&phi;",
  "&chi;",
  "&psi;",
  "&omega;",
  "&thetasym;",
  "&upsih;",
  "&piv;",
  "&bull;",
  "&hellip;",
  "&prime;",
  "&Prime;",
  "&oline;",
  "&frasl;",
  "&weierp;",
  "&image;",
  "&real;",
  "&trade;",
  "&alefsym;",
  "&larr;",
  "&uarr;",
  "&rarr;",
  "&darr;",
  "&harr;",
  "&crarr;",
  "&lArr;",
  "&uArr;",
  "&rArr;",
  "&dArr;",
  "&hArr;",
  "&forall;",
  "&part;",
  "&exist;",
  "&empty;",
  "&nabla;",
  "&isin;",
  "&notin;",
  "&ni;",
  "&prod;",
  "&sum;",
  "&minus;",
  "&lowast;",
  "&radic;",
  "&prop;",
  "&infin;",
  "&ang;",
  "&and;",
  "&or;",
  "&cap;",
  "&cup;",
  "&int;",
  "&there4;",
  "&sim;",
  "&cong;",
  "&asymp;",
  "&ne;",
  "&equiv;",
  "&le;",
  "&ge;",
  "&sub;",
  "&sup;",
  "&nsub;",
  "&sube;",
  "&supe;",
  "&oplus;",
  "&otimes;",
  "&perp;",
  "&sdot;",
  "&lceil;",
  "&rceil;",
  "&lfloor;",
  "&rfloor;",
  "&lang;",
  "&rang;",
  "&loz;",
  "&spades;",
  "&clubs;",
  "&hearts;",
  "&diams;",
  "&quot;",
  "&amp;",
  "&lt;",
  "&gt;",
  "&OElig;",
  "&oelig;",
  "&Scaron;",
  "&scaron;",
  "&Yuml;",
  "&circ;",
  "&tilde;",
  "&ensp;",
  "&emsp;",
  "&thinsp;",
  "&zwnj;",
  "&zwj;",
  "&lrm;",
  "&rlm;",
  "&ndash;",
  "&mdash;",
  "&lsquo;",
  "&rsquo;",
  "&sbquo;",
  "&ldquo;",
  "&rdquo;",
  "&bdquo;",
  "&dagger;",
  "&Dagger;",
  "&permil;",
  "&lsaquo;",
  "&rsaquo;",
  "&euro;",
];

const escapeCharactersMap = escapeCharacters.reduce(
  (acc, escapeCharacter, index) => {
    return Object.assign(acc, { [escapeCharacter]: charachers[index] });
  },
  {}
);

export default escapeCharactersMap;

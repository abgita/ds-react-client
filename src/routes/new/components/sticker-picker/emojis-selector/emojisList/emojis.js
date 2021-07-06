export default [
  set(0, '🔥',
    '😉', '👍', '🥰', '❤', '😍', '😘', '🤗', '😙', '😊',
    '😌', '🎵', '🎧', '🎼', '🎶', '📻',
    '😎',
    '😡', '😠', '😡', '🤬', '👊',
    '😢', '😧', '😔', '😔', '😢',
    '😭', '💔',
    '😕', '😟',
    '🥳', '💃', '🕺', '🤟',
    '🤪', '🤭', '😝', '😜', '😛',
    '😂', '🤣', '😄', '😆',
    '😤', '😑', '👎', '🖕',
    '💪', '🦾'
  ),

  set(1, '😉', '👍'),
  set(1, '🥰', '❤', '😍', '😘', '🤗', '😙', '😊'),
  set(1, '😌', '🎵', '🎧', '🎼', '🎶', '📻'),
  set(1, '😎'),
  set(1, '😡', '😠', '😡', '🤬', '👊'),
  set(1, '😢', '😧', '😔', '😔', '😢'),
  set(1, '😭', '💔'),
  set(1, '😕', '😟'),
  set(1, '🥳', '💃', '🕺', '🤟'),
  set(1, '🤪', '🤭', '😝', '😜', '😛'),
  set(1, '😂', '🤣', '😄', '😆'),
  set(1, '😤', '😑', '👎', '🖕'),
  set(1, '💪', '🦾')
];

/**
 * @param mask whether the set includes or excludes (1 or 0) the main emoji
 * @param emoji the main emoji (the one shown on the list, as button)
 * @param set the emoji set
 * @returns {{set: array, codePoint: string, mask: number}}
 */
function set (mask, emoji, ...set) {
  const codePoint = toCodePoint(emoji);

  return {
    set: [emoji].concat(set),
    codePoint: codePoint,
    mask: mask
  };
}

/**
 * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
 *
 * @param   unicodeSurrogates   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
 * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
 *
 * @example
 *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
 *  // "1f1e8-1f1f3"
 *
 *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
 *  // "1f1e8~1f1f3"
 *
 * @note from https://github.com/twitter/twemoji [twemoji.convert.#toCodePoint(a,b)] with a small modification
 */
function toCodePoint (unicodeSurrogates) {
  const r = [];
  let c = 0;
  let p = 0;
  let i = 0;

  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);

    if (p) {
      r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
      p = 0;
    } else if (c >= 0xD800 && c <= 0xDBFF) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }

  return r.join('-');
}

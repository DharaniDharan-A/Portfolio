export type TokenKind =
  | 'keyword'
  | 'string'
  | 'decorator'
  | 'type'
  | 'number'
  | 'function'
  | 'property'
  | 'punct'
  | 'comment'
  | 'plain';

export interface Token {
  text: string;
  kind: TokenKind;
}

// One alternative per capture group, in priority order. Group n → KINDS[n - 1].
const PATTERN = new RegExp(
  [
    /(\/\/.*)/, // comment
    /('(?:[^'\\]|\\.)*')/, // string
    /(@[A-Za-z]\w*)/, // decorator
    /\b(import|from|export|class|const|readonly|this|new|return|true|false)\b/, // keyword
    /\b([A-Z]\w*)\b/, // type
    /(-?\b\d+(?:\.\d+)?\b)/, // number
    /([A-Za-z_$][\w$]*)(?=\()/, // function call
    /([A-Za-z_$][\w$]*)(?=\s*[=:](?![=>]))/, // property / assignment target
    /(=>|[{}()[\];,.<>=:?!+\-*/|&])/, // punctuation
  ]
    .map((part) => part.source)
    .join('|'),
  'g',
);

const KINDS: TokenKind[] = [
  'comment',
  'string',
  'decorator',
  'keyword',
  'type',
  'number',
  'function',
  'property',
  'punct',
];

/**
 * A deliberately small TypeScript highlighter — enough for the handful of
 * lines this site renders, not a general parser. Returns tokens per line;
 * whitespace and anything unrecognised come through as `plain`.
 */
export function highlight(source: string): Token[][] {
  return source.split('\n').map((line) => {
    const tokens: Token[] = [];
    let last = 0;
    for (const match of line.matchAll(PATTERN)) {
      const index = match.index ?? 0;
      if (index > last) tokens.push({ text: line.slice(last, index), kind: 'plain' });
      const group = match.findIndex((value, i) => i > 0 && value !== undefined);
      tokens.push({ text: match[0], kind: KINDS[group - 1] ?? 'plain' });
      last = index + match[0].length;
    }
    if (last < line.length) tokens.push({ text: line.slice(last), kind: 'plain' });
    return tokens;
  });
}

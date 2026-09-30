import { LinkifyIt } from 'linkify-it';

export type LinkKind = 'url' | 'email' | 'phone';

export type TextPart = {
  type: 'text';
  value: string;
};

export type LinkPart = {
  type: 'link';
  kind: LinkKind;
  // the text as written by the user
  value: string;
  // the url to open
  url: string;
};

export type LinkifyPart = TextPart | LinkPart;

// fuzzyLink allows matching urls written without a scheme, e.g. "example.com/foo"
const linkify = new LinkifyIt({ fuzzyLink: true });

// Phone numbers are not handled by linkify-it, we look for them ourselves.
// We only match numbers written in international format (+33… / 0033…) or in
// national format (starting with a trunk prefix "0"), to avoid turning random
// numbers (order totals, ids, dates…) into phone links.
const PHONE_PATTERN = /(?:\+|00)\d(?:[\s.-]?\d){6,14}|0\d(?:[\s.-]?\d){7,13}/g;

const countDigits = (str: string) => (str.match(/\d/g) || []).length;

const isPhoneBoundary = (text: string, start: number, end: number) => {
  const before = start > 0 ? text[start - 1] : '';
  const after = end < text.length ? text[end] : '';

  return !/[\d\w+]/.test(before) && !/[\d\w]/.test(after);
};

const matchPhones = (text: string): LinkPart[] => {
  const matches: LinkPart[] = [];

  for (const match of text.matchAll(PHONE_PATTERN)) {
    const value = match[0];
    const index = match.index ?? 0;

    if (!isPhoneBoundary(text, index, index + value.length)) {
      continue;
    }

    const digits = countDigits(value);
    if (digits < 8 || digits > 15) {
      continue;
    }

    matches.push({
      type: 'link',
      kind: 'phone',
      value,
      url: `tel:${value.replace(/[\s.()-]/g, '')}`,
    });
  }

  return matches;
};

/**
 * Splits a text into plain text & link parts (urls, emails & phone numbers),
 * keeping the original text intact.
 */
export const parseLinks = (text: string): LinkifyPart[] => {
  if (!text) {
    return [];
  }

  const parts: LinkifyPart[] = [];
  const matches = linkify.match(text) || [];
  let cursor = 0;

  const pushText = (value: string) => {
    if (!value) {
      return;
    }
    // phone numbers are only searched for outside of urls & emails
    let offset = 0;
    for (const phone of matchPhones(value)) {
      const index = value.indexOf(phone.value, offset);
      if (index > offset) {
        parts.push({ type: 'text', value: value.slice(offset, index) });
      }
      parts.push(phone);
      offset = index + phone.value.length;
    }
    if (offset < value.length) {
      parts.push({ type: 'text', value: value.slice(offset) });
    }
  };

  for (const match of matches) {
    pushText(text.slice(cursor, match.index));
    parts.push({
      type: 'link',
      kind: match.schema === 'mailto:' ? 'email' : 'url',
      value: match.raw,
      url: match.url,
    });
    cursor = match.lastIndex;
  }

  pushText(text.slice(cursor));

  return parts;
};

export const hasLinks = (text: string) =>
  parseLinks(text).some(part => part.type === 'link');

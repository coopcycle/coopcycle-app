import { hasLinks, parseLinks } from '../linkify';

const links = text => parseLinks(text).filter(part => part.type === 'link');

describe('parseLinks', () => {
  it('returns an empty array for an empty text', () => {
    expect(parseLinks('')).toEqual([]);
  });

  it('keeps a text without links as is', () => {
    const text = 'Ring 3 times, 2nd floor';
    expect(parseLinks(text)).toEqual([{ type: 'text', value: text }]);
    expect(hasLinks(text)).toBe(false);
  });

  it('detects urls', () => {
    expect(links('See https://example.com/form?id=2 for more infos')).toEqual([
      {
        type: 'link',
        kind: 'url',
        value: 'https://example.com/form?id=2',
        url: 'https://example.com/form?id=2',
      },
    ]);
  });

  it('detects urls without a scheme', () => {
    expect(links('docs.google.com/forms/1234')).toEqual([
      {
        type: 'link',
        kind: 'url',
        value: 'docs.google.com/forms/1234',
        url: 'http://docs.google.com/forms/1234',
      },
    ]);
  });

  it('detects email addresses', () => {
    expect(links('write to john@example.com')).toEqual([
      {
        type: 'link',
        kind: 'email',
        value: 'john@example.com',
        url: 'mailto:john@example.com',
      },
    ]);
  });

  it('detects phone numbers in national format', () => {
    expect(links('second phone 06 12 34 56 78')).toEqual([
      {
        type: 'link',
        kind: 'phone',
        value: '06 12 34 56 78',
        url: 'tel:0612345678',
      },
    ]);
    expect(links('call 06.12.34.56.78')[0].url).toEqual('tel:0612345678');
    expect(links('call 0612345678')[0].url).toEqual('tel:0612345678');
  });

  it('detects phone numbers in international format', () => {
    expect(links('call +33 6 12 34 56 78')[0]).toEqual({
      type: 'link',
      kind: 'phone',
      value: '+33 6 12 34 56 78',
      url: 'tel:+33612345678',
    });
    expect(links('call 0033612345678')[0].url).toEqual('tel:0033612345678');
  });

  it('does not detect random numbers as phone numbers', () => {
    expect(links('order 12345678 - 25.50 EUR')).toEqual([]);
    expect(links('code 1234')).toEqual([]);
    expect(links('12/08/2024')).toEqual([]);
  });

  it('does not look for phone numbers inside urls', () => {
    expect(links('https://example.com/0612345678')).toEqual([
      {
        type: 'link',
        kind: 'url',
        value: 'https://example.com/0612345678',
        url: 'https://example.com/0612345678',
      },
    ]);
  });

  it('splits a text into text & link parts', () => {
    expect(
      parseLinks('call 06 12 34 56 78 or see https://example.com'),
    ).toEqual([
      { type: 'text', value: 'call ' },
      {
        type: 'link',
        kind: 'phone',
        value: '06 12 34 56 78',
        url: 'tel:0612345678',
      },
      { type: 'text', value: ' or see ' },
      {
        type: 'link',
        kind: 'url',
        value: 'https://example.com',
        url: 'https://example.com',
      },
    ]);
  });
});

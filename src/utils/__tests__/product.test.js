import { parseOptionValuesRange } from '../product';

describe('product utils', () => {
  it('parses values range', () => {
    expect(parseOptionValuesRange('[1,4]')).toEqual([1, 4]);
    expect(parseOptionValuesRange('[0,4]')).toEqual([0, 4]);
    expect(parseOptionValuesRange('[0,]')).toEqual([0, Infinity]);
    expect(parseOptionValuesRange('[1,]')).toEqual([1, Infinity]);
    expect(parseOptionValuesRange('[12,12]')).toEqual([12, 12]);
  });
});

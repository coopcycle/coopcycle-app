import Address from '../Address';

const paris = { geo: { latitude: 48.856614, longitude: 2.352222 } };
const toulouse = { geo: { latitude: 43.604652, longitude: 1.444209 } };

describe('Address.isSameGeo', () => {
  it('returns true for two addresses at the same coordinates', () => {
    expect(Address.isSameGeo(paris, { ...paris })).toBe(true);
  });

  it('returns false for two addresses at different coordinates', () => {
    expect(Address.isSameGeo(paris, toulouse)).toBe(false);
  });

  it('returns false when an address is missing', () => {
    expect(Address.isSameGeo(paris, null)).toBe(false);
    expect(Address.isSameGeo(null, paris)).toBe(false);
    expect(Address.isSameGeo(null, null)).toBe(false);
  });

  it('returns false when an address has no coordinates', () => {
    expect(Address.isSameGeo(paris, { streetAddress: '1 rue de Paris' })).toBe(
      false,
    );
  });
});

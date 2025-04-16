import { areSameDates } from "../dates";

describe('areSameDates', () => {
  it('should return TRUE if both dates are the same, nevertheless of hours, minutes and seconds', () => {
    const date1 = new Date('2025-04-07T03:24:00');
    const date2 = new Date('2025-04-07T00:00:00');

    expect(areSameDates(date1, date2)).toBeTruthy();
  })

  it('should return FALSE if dates are the different', () => {
    const date1 = new Date('2025-04-07T00:00:00');
    const date2 = new Date('2025-04-08T00:00:00');

    expect(areSameDates(date1, date2)).toBeFalsy();
  })
})

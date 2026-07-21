import { calculateSips, getSipsMessage } from './sipsCalculator';

describe('calculateSips', () => {
  it('returns 2 sips when time is up', () => {
    expect(calculateSips(0, 30, true)).toBe(2);
    expect(calculateSips(0, 30, false)).toBe(2);
  });

  it('returns 6 sips when almost all time remains (>= 80%)', () => {
    expect(calculateSips(28, 30)).toBe(6);
  });

  it('returns 5 sips between 60% and 79% time remaining', () => {
    expect(calculateSips(20, 30)).toBe(5);
  });

  it('returns 4 sips between 40% and 59% time remaining', () => {
    expect(calculateSips(15, 30)).toBe(4);
  });

  it('returns 3 sips between 20% and 39% time remaining', () => {
    expect(calculateSips(8, 30)).toBe(3);
  });

  it('returns the base 2 sips below 20% time remaining', () => {
    expect(calculateSips(2, 30)).toBe(2);
  });
});

describe('getSipsMessage', () => {
  it('returns the time-up message when time is up', () => {
    expect(getSipsMessage(2, 0, 30, true)).toBe('Plus de temps ! 2 gorgées');
  });

  it('returns a message matching the time-remaining bracket', () => {
    expect(getSipsMessage(6, 28, 30)).toBe('Beaucoup de temps restant = 6 gorgées !');
  });
});

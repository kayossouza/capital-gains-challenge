import { roundToTwoDecimalPlaces } from '../../src/utilities/numberUtilities';

describe('roundToTwoDecimalPlaces', () => {
  it('should correctly round a number to two decimal places', () => {
    const value = 3.14159;
    const expectedValue = 3.14;

    const roundedValue = roundToTwoDecimalPlaces(value);

    expect(roundedValue).toEqual(expectedValue);
  });

  it('should correctly round a number up to two decimal places', () => {
    const value = 3.145;
    const expectedValue = 3.15;

    const roundedValue = roundToTwoDecimalPlaces(value);

    expect(roundedValue).toEqual(expectedValue);
  });
});

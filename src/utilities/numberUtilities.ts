/**
 * Round a number to two decimal places.
 * @param value The number to round.
 * @returns The number rounded to two decimal places.
 */

export const roundToTwoDecimalPlaces = (value: number): number => {
  return parseFloat(value.toFixed(2));
};

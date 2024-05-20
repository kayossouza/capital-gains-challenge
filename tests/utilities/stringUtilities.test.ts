import { isEmptyLine } from '../../src/utilities/stringUtilities';

describe('isEmptyLine', () => {
  it('should return true for an empty line', () => {
    const line = '   ';
    const expected = true;

    const result = isEmptyLine(line);

    expect(result).toEqual(expected);
  });

  it('should return false for a non-empty line', () => {
    const line = '  Hello, world!  ';
    const expected = false;

    const result = isEmptyLine(line);

    expect(result).toEqual(expected);
  });

  it('should return true for an empty string', () => {
    const line = '';
    const expected = true;

    const result = isEmptyLine(line);

    expect(result).toEqual(expected);
  });
});

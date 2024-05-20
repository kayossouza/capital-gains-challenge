import { printJSON } from '../../src/utilities/printUtilities';

// Spy on console.log
// This will replace the console.log function with a mock function
// that keeps track of calls to it.
describe('printJSON', () => {
  it('should correctly print a JSON object', () => {
    const json = { key: 'value' };
    const expectedOutput = JSON.stringify(json);

    console.log = jest.fn();

    printJSON(json);

    expect(console.log).toHaveBeenCalledWith(expectedOutput);
  });
});

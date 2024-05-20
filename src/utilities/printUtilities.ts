/**
 * Print objects to the console.
 * @param json The object to print.
 * @returns void
 */

export const printJSON = (json: unknown): void => {
  console.log(JSON.stringify(json));
};

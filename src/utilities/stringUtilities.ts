/**
 * Checks if a line is empty.
 * @param line The line to check.
 * @returns boolean
 *
 * This function was needed to avoid bugs when checking
 * for empty lines. The function is synchronous because
 * it doesn't perform any I/O operations.
 * The trim() method is used to remove any leading or trailing
 * whitespace from the line before checking if it is empty.
 */

export const isEmptyLine = (line: string): boolean => line.trim() === '';

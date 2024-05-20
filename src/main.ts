#!/usr/bin/env node

import * as readline from 'readline';
import { isEmptyLine } from './utilities/stringUtilities';

import { queue } from 'async';
import {
  addOperationsFromLineToBatch,
  clearOperationBatches,
  processAllOperationBatches,
} from './operations/operationProcessing';
import { OperationBatches } from './types/OperationBatches';
import { OperationsOutcome } from './types/OperationsOutcome';
import { printJSON } from './utilities/printUtilities';
import { InputLineTask } from './types/InputLineTask';

/**
 * The maximum concurrency for the line queue.
 */
const MAX_CONCURRENCY = 1;

/**
 * OperationBatches is an array of operation arrays. Each inner array represents a batch of operations.
 * The batches are processed in the order they are read from the input lines.
 *
 * An empty line in the input triggers the following sequence:
 * 1. All current batches are processed.
 * 2. The resulting taxes are printed.
 * 3. The operation batches are reset for the next set of operations.
 *
 * A non-empty line in the input adds its operations to the current batch.
 * The batch is then updated with operations from the next line.
 * This continues until all input lines have been processed.
 */

let operationBatches: OperationBatches = [];

/**
 * The line queue.
 * This queue processes lines of input asynchronously.
 * It ensures that operations are processed in the order they are read.
 */

export const operationsProcessingQueue = queue(
  async (task: InputLineTask, done: () => void) => {
    operationBatches = await processLine(task.line, operationBatches);
    done();
  },
  MAX_CONCURRENCY,
);

/**
 * Processes a line of input.
 * @param line The line to process.
 * @param operationBatches The current operation batches.
 * @returns The updated operation batches.
 *
 * This function processes a line of input.
 * If the line is empty, it processes all operation batches and prints the taxes.
 * Otherwise, it adds the operations from the line to the operation batches.
 * The updated operation batches are then returned.
 */

export const processLine = async (
  line: string,
  operationBatches: OperationBatches,
): Promise<OperationBatches> => {
  if (isEmptyLine(line)) {
    // Process all operation batches and return the outcome of the operations.
    const operationsOutcome: OperationsOutcome[] =
      await processAllOperationBatches(operationBatches);

    operationsOutcome.forEach((OperationsOutcome) => {
      printJSON(OperationsOutcome.taxes);
    });
    return clearOperationBatches();
  } else {
    return addOperationsFromLineToBatch(line, operationBatches);
  }
};

/**
 * The readline interface.
 * This interface is used to read input from the console.
 * The input and output properties are set to process.stdin and process.stdout respectively.
 * This allows the program to read input from the console and write output to the console.
 */
const readlineInterface = readline.createInterface({
  // The input and output properties are set to process.stdin and process.stdout respectively.
  input: process.stdin,
  output: process.stdout,
  terminal: false, // This is set to false to prevent the interface from closing when the input stream ends.
});

/**
 * The readlineInterface variable listens for the 'line' event, which is emitted when a line of input is read.
 * When a line is read, the line is pushed to the line queue.
 */
readlineInterface.on('line', async (line: string) => {
  operationsProcessingQueue.push({ line }, () => {
    // The line has been processed.
  });
});

readlineInterface.on('close', () => {
  // The input stream has ended.
  // The line queue is drained to ensure that all lines are processed before the program exits.
  operationsProcessingQueue.drain(() => {
    process.exit(0);
  });
});

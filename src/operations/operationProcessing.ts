/*
 * This file is responsible for processing operation batches.
 * An operation batch is a list of operations that are processed together.
 * This file provides functions to add operations to a batch, process the taxes for all operations in a batch, and reset the operation batches.
 *
 * The operation batches are stored in the `operationBatches` variable.
 * The `evaluateOperationsOutcome` function that manages the outcome of a list of operations.
 * The `processAllOperationBatches` triggers the processing of all operation batches.
 * The `clearBatchedOperations` function resets the operation batches.
 * The `addOperationsFromLineToBatch` function adds operations to the batch from a line.
 */

import { Operation } from '../types/Operation';
import { OperationsOutcome } from '../types/OperationsOutcome';
import { OperationBatches } from '../types/OperationBatches';
import { processBuyOperation } from '../operations/handlers/buyOperationHandler';
import { processSellOperation } from '../operations/handlers/sellOperationHandler';

/**
 * Evaluates the outcome of a list of operations.
 * @param operations The operations to evaluate.
 * @returns The outcome of the operations.
 *
 * This function evaluates the outcome of a list of operations.
 * It calculates the weighted average price, the total number of shares, the total loss, and the taxes for the operations.
 * The outcome is returned as an object with these values.
 */

export const evaluateOperationsOutcome = (operations: Operation[]): OperationsOutcome => {
  const initialOperationsOutcome: OperationsOutcome = {
    weightedAveragePrice: 0,
    shares: 0,
    loss: 0,
    taxes: [],
    errorCounter: 0,
  };

  return operations.reduce((operationsOutcome, operation) => {
    return operation.operation === 'buy'
      ? processBuyOperation(operationsOutcome, operation)
      : processSellOperation(operationsOutcome, operation);
  }, initialOperationsOutcome);
};

/**
 * Processes all operation batches.
 * @param operationBatches The operation batches to process.
 * @returns Promise<OperationsOutcome[]> The outcome of all operations.
 *
 * Promise.all is used to process all operation batches in parallel. This is more performant than processing them sequentially.
 */
export const processAllOperationBatches = async (operationBatches: OperationBatches): Promise<OperationsOutcome[]> => {
  return Promise.all(operationBatches.map(evaluateOperationsOutcome));
};

/**
 * Adds operations to the batch from a line.
 * @param line The line to parse.
 * @param operationBatch The current operation batch.
 * @returns Promise<OperationBatches> The updated operation batch.
 *
 * This function parses the JSON from a line and adds the operations to the batch.
 *
 */
export const addOperationsFromLineToBatch = async (
  line: string,
  operationBatch: OperationBatches,
): Promise<OperationBatches> => {
  // JSON.parse was more performant than a custom parser, so it was used to parse the line.
  const operationsList: Operation[] = JSON.parse(line) as Operation[];
  const newOperationBatches = [...operationBatch, operationsList];
  return newOperationBatches;
};

/**
 * Resets the operation batches.
 * @returns void
 *
 * This function resets the operation batches.
 */
export const clearOperationBatches = (): OperationBatches => {
  // Clear the operation batches. Using the empty array is more performant than creating a new array.
  return [];
};

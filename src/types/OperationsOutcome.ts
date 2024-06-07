/**
 * OperationsOutcome type.
 *
 * Represents the outcome of a series of operations.
 * The outcome includes the weighted average price, the total number of shares, the total loss, and the taxes for the operations.
 * The taxes are represented as an array of Tax objects.
 */

import { Tax } from './Tax';
import { OperationError } from './OperationError';

export type OperationsOutcome = {
  weightedAveragePrice: number;
  shares: number;
  loss: number;
  taxes: Array<Tax | OperationError>;
  errorCounter: number;
};

/**
 * Operation type
 * Represents a buy or sell operation.
 */

export type Operation = {
  operation: 'buy' | 'sell';
  'unit-cost': number;
  quantity: number;
};

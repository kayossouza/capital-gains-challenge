import {
  addOperationsFromLineToBatch,
  clearOperationBatches,
  evaluateOperationsOutcome,
  processAllOperationBatches,
} from '../../src/operations/operationProcessing';
import { Operation } from '../../src/types/Operation';
import { OperationBatches } from '../../src/types/OperationBatches';
import { OperationsOutcome } from '../../src/types/OperationsOutcome';

describe('operationProcessing', () => {
  it('should correctly evaluate operations outcome', () => {
    const operations: Operation[] = [
      { operation: 'buy', 'unit-cost': 10.0, quantity: 100 },
      { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
      { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
    ];

    const expectedOutcome: OperationsOutcome = {
      loss: 0,
      shares: 0,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
      weightedAveragePrice: 10,
    };
    expect(evaluateOperationsOutcome(operations)).toEqual(expectedOutcome);
  });

  it('should correctly process all operation batches', async () => {
    /**
     * This are the test cases from the technical challenge.
     */
    const operationBatches: OperationBatches = [
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 5.0, quantity: 5000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 5.0, quantity: 5000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 5.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 3000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 25.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 10000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 25.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 25.0, quantity: 5000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 2.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 25.0, quantity: 1000 },
      ],
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 2.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
        { operation: 'sell', 'unit-cost': 25.0, quantity: 1000 },
        { operation: 'buy', 'unit-cost': 20.0, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 30.0, quantity: 4350 },
        { operation: 'sell', 'unit-cost': 30.0, quantity: 650 },
      ],
    ];
    const expectedOutcome: OperationsOutcome[] = [
      {
        loss: 0,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 25000,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 10000 }, { tax: 0 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 0,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 25000,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 10000 }, { tax: 0 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 0,
        shares: 2000,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 1000 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 0,
        shares: 5000,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
        weightedAveragePrice: 15,
      },
      {
        loss: 0,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 10000 }],
        weightedAveragePrice: 15,
      },
      {
        loss: 0,
        shares: 0,
        taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 3000 }],
        weightedAveragePrice: 10,
      },
      {
        loss: 0,
        shares: 0,
        taxes: [
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 3000 },
          { tax: 0 },
          { tax: 0 },
          { tax: 3700 },
          { tax: 0 },
        ],
        weightedAveragePrice: 20,
      },
    ];
    expect(await processAllOperationBatches(operationBatches)).toEqual(
      expectedOutcome,
    );
  });

  it('should correctly add operations from line to batch', async () => {
    const line =
      '[{ "operation": "buy", "unit-cost": 10.00, "quantity": 100 }, { "operation": "sell", "unit-cost": 15.00, "quantity": 50 }, { "operation": "sell", "unit-cost": 15.00, "quantity": 50 }]';
    const operationBatch: OperationBatches = [];
    const expectedBatch: OperationBatches = [
      [
        { operation: 'buy', 'unit-cost': 10.0, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
        { operation: 'sell', 'unit-cost': 15.0, quantity: 50 },
      ],
    ];
    expect(await addOperationsFromLineToBatch(line, operationBatch)).toEqual(
      expectedBatch,
    );
  });

  it('should correctly clear operation batches', () => {
    expect(clearOperationBatches()).toEqual([]);
  });

  it('should return initial outcome when operations array is empty', () => {
    const operations: Operation[] = [];
    const expectedOutcome: OperationsOutcome = {
      loss: 0,
      shares: 0,
      taxes: [],
      weightedAveragePrice: 0,
    };
    expect(evaluateOperationsOutcome(operations)).toEqual(expectedOutcome);
  });

  it('should return empty array when operationBatches array is empty', async () => {
    const operationBatches: OperationBatches = [];
    expect(await processAllOperationBatches(operationBatches)).toEqual([]);
  });

  it('should throw error when line contains invalid JSON', async () => {
    const line = '{ invalid json }';
    const operationBatch: OperationBatches = [];
    await expect(
      addOperationsFromLineToBatch(line, operationBatch),
    ).rejects.toThrow();
  });

  it('should return the correct outcome for a non-empty operations array', () => {
    const operations: Operation[] = [
      { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
      { operation: 'sell', 'unit-cost': 2.0, quantity: 5000 },
      { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
      { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
      { operation: 'sell', 'unit-cost': 25.0, quantity: 1000 },
      { operation: 'buy', 'unit-cost': 20.0, quantity: 10000 },
      { operation: 'sell', 'unit-cost': 15.0, quantity: 5000 },
      { operation: 'sell', 'unit-cost': 30.0, quantity: 4350 },
      { operation: 'sell', 'unit-cost': 30.0, quantity: 650 },
    ];

    const expectedOutcome: OperationsOutcome = {
      loss: 0,
      shares: 0,
      taxes: [
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 3000.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 3700.0 },
        { tax: 0.0 },
      ],
      weightedAveragePrice: 20,
    };
    expect(evaluateOperationsOutcome(operations)).toEqual(expectedOutcome);
  });
});

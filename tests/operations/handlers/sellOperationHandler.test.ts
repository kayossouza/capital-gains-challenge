import { Operation } from '../../../src/types/Operation';
import { OperationsOutcome } from '../../../src/types/OperationsOutcome';

import * as sellOperationHandler from '../../../src/operations/handlers/sellOperationHandler';

describe('processSellOperation', () => {
  it('should correctly process a sell operation', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'sell',
      'unit-cost': 20,
      quantity: 50,
    };

    const result: OperationsOutcome = sellOperationHandler.processSellOperation(
      operationsOutcome,
      operation,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 50,
      taxes: [{ tax: 0 }, { tax: 0 }],
    });
  });

  it('should deduct the profit from the loss after selling shares with existent debt', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 2500,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'sell',
      'unit-cost': 50,
      quantity: 50,
    };

    const result = sellOperationHandler.processSellOperation(
      operationsOutcome,
      operation,
    );

    expect(result).toEqual({
      loss: 500, // 2500 - 2000 from the profit
      weightedAveragePrice: 10,
      shares: 50,
      taxes: [{ tax: 0 }, { tax: 0 }],
    });
  });
});

describe('Integration Test', () => {
  // why is this an integration test?
  // This is an integration test because it tests the interaction between the processSellOperation function and the evaluateOperationsOutcome function.
  // The processSellOperation function is called by the evaluateOperationsOutcome function to process sell operations.
  // This test checks that the evaluateOperationsOutcome function correctly processes a series of sell operations.
  it('should correctly process a series of sell operations', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 20,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 30,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 200,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });

  it('should correctly process a series of sell operations with a loss', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 5,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 10,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 200,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 250,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });

  it('should correctly process a series of sell operations with a profit', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 20,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 10,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 200,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });

  it('should correctly process a series of sell operations with a profit and a loss', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 5,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 20,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 200,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });

  it('should tax 20% of the profit for operations with a total value greater than 20000 and a profit', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 500,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 2000,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 2000,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 1900,
      taxes: [{ tax: 0 }, { tax: 4900 }, { tax: 19900 }],
    });
  });

  it('should not apply tax to operations with a total value less than or equal to 20000', () => {
    const operations: Operation[] = [
      {
        operation: 'sell',
        'unit-cost': 50,
        quantity: 50,
      },
      {
        operation: 'sell',
        'unit-cost': 20,
        quantity: 50,
      },
    ];
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 200,
      taxes: [{ tax: 0 }],
    };

    const result = operations.reduce(
      sellOperationHandler.processSellOperation,
      operationsOutcome,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });
});

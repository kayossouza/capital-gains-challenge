import { Operation } from '../../../src/types/Operation';
import { OperationsOutcome } from '../../../src/types/OperationsOutcome';

import * as buyOperationHandler from '../../../src/operations/handlers/buyOperationHandler';
describe('processBuyOperation', () => {
  it('should correctly process a buy operation', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 20,
      quantity: 50,
    };
    const result = buyOperationHandler.processBuyOperation(
      operationsOutcome,
      operation,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 13.33,
      shares: 150,
      taxes: [{ tax: 0 }, { tax: 0 }],
    });
  });

  it('should always add a tax of 0 to the taxes array', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 20,
      quantity: 50,
    };
    const result = buyOperationHandler.processBuyOperation(
      operationsOutcome,
      operation,
    );

    expect(result.taxes).toEqual([{ tax: 0 }, { tax: 0 }]);
  });

  it('should update the shares correctly', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 10,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 20,
      quantity: 50,
    };
    const result = buyOperationHandler.processBuyOperation(
      operationsOutcome,
      operation,
    );

    expect(result.shares).toBe(150);
  });

  it('should correctly process a buy operation with operationsOutcome on default values', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 0,
      shares: 0,
      taxes: [],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 20,
      quantity: 50,
    };
    const result = buyOperationHandler.processBuyOperation(
      operationsOutcome,
      operation,
    );

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 20,
      shares: 50,
      taxes: [{ tax: 0 }],
    });
  });

  it('should handle null operationsOutcome', () => {
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 20,
      quantity: 50,
    };
    expect(() =>
      buyOperationHandler.processBuyOperation(
        {} as OperationsOutcome,
        operation,
      ),
    ).toThrow();
  });

  // it('should handle null operation', () => {
  //   const operationsOutcome: OperationsOutcome = {
  //     loss: 0,
  //     weightedAveragePrice: 10,
  //     shares: 100,
  //     taxes: [{ tax: 0 }],
  //   };
  //   expect(() =>
  //     buyOperationHandler.processBuyOperation(operationsOutcome, null),
  //   ).toThrow();
  // });

  // it('should handle undefined operation', () => {
  //   const operationsOutcome: OperationsOutcome = {
  //     loss: 0,
  //     weightedAveragePrice: 10,
  //     shares: 100,
  //     taxes: [{ tax: 0 }],
  //   };
  //   expect(() =>
  //     buyOperationHandler.processBuyOperation(operationsOutcome, undefined),
  //   ).toThrow();
  // });
});

describe('calculateWeightedAveragePrice', () => {
  it('should correctly calculate the weighted average price', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 20,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 50,
      quantity: 200,
    };
    const calculateWeightedAveragePriceSpy = jest.spyOn(
      buyOperationHandler,
      'calculateWeightedAveragePrice',
    );

    const result = buyOperationHandler.calculateWeightedAveragePrice(
      operationsOutcome,
      operation,
    );
    expect(result).toBe(40);
    expect(calculateWeightedAveragePriceSpy).toHaveBeenCalledWith(
      operationsOutcome,
      operation,
    );
  });

  it('should correctly calculate the weighted average price when the quantity is 0', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 20,
      shares: 100,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 50,
      quantity: 0,
    };
    const calculateWeightedAveragePriceSpy = jest.spyOn(
      buyOperationHandler,
      'calculateWeightedAveragePrice',
    );

    const result = buyOperationHandler.calculateWeightedAveragePrice(
      operationsOutcome,
      operation,
    );
    expect(result).toBe(20);
    expect(calculateWeightedAveragePriceSpy).toHaveBeenCalledWith(
      operationsOutcome,
      operation,
    );
  });

  it('should correctly calculate the weighted average price when the shares is 0', () => {
    const operationsOutcome: OperationsOutcome = {
      loss: 0,
      weightedAveragePrice: 0,
      shares: 0,
      taxes: [{ tax: 0 }],
    };
    const operation: Operation = {
      operation: 'buy',
      'unit-cost': 50,
      quantity: 100,
    };
    const calculateWeightedAveragePriceSpy = jest.spyOn(
      buyOperationHandler,
      'calculateWeightedAveragePrice',
    );

    const result = buyOperationHandler.calculateWeightedAveragePrice(
      operationsOutcome,
      operation,
    );
    expect(result).toBe(50);
    expect(calculateWeightedAveragePriceSpy).toHaveBeenCalledWith(
      operationsOutcome,
      operation,
    );
  });
});

describe('Integration test', () => {
  it('should correctly process a list of operations', () => {
    const operations: Operation[] = [
      {
        operation: 'buy',
        'unit-cost': 20,
        quantity: 50,
      },
      {
        operation: 'buy',
        'unit-cost': 30,
        quantity: 100,
      },
      {
        operation: 'buy',
        'unit-cost': 50,
        quantity: 200,
      },
    ];
    const result = operations.reduce(buyOperationHandler.processBuyOperation, {
      loss: 0,
      weightedAveragePrice: 0,
      shares: 0,
      taxes: [],
    });

    expect(result).toEqual({
      loss: 0,
      weightedAveragePrice: 40,
      shares: 350,
      taxes: [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
    });
  });
});

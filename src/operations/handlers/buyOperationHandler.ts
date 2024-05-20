import { Operation } from '../../types/Operation';
import { OperationsOutcome } from '../../types/OperationsOutcome';
import { roundToTwoDecimalPlaces } from '../../utilities/numberUtilities';

/**
 * Function to handle a buy operation.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param operation The buy operation to be performed.
 * @returns the update outcome after the last operation.
 *
 * This function processes a buy operation.
 * It calculates the new weighted average price and updates the operations outcome with the new weighted average price, the new number of shares, and a tax of 0.
 */
export const processBuyOperation = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
): OperationsOutcome => {
  const weightedAveragePrice = calculateWeightedAveragePrice(
    operationsOutcome,
    operation,
  );
  return {
    ...operationsOutcome,
    weightedAveragePrice: weightedAveragePrice,
    shares: operationsOutcome.shares + operation.quantity,
    taxes: [...operationsOutcome.taxes, { tax: 0 }],
  };
};

/**
 * Function to calculate the weighted average price.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param operation The buy operation to be performed.
 * @returns The weighted average price.
 *
 * This function calculates the new weighted average price after a buy operation.
 * The new weighted average is calculated as ((currentShares * currentAveragePrice) + (newShares * purchasePrice)) / (currentShares + newShares).
 * For example, if you bought 10 shares at R$20.00, sold 5, then bought another 5 at R$10.00, the weighted average is ((5 * 20.00) + (5 * 10.00)) / (5 + 5) = 15.00.
 */
export const calculateWeightedAveragePrice = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
): number => {
  const totalSharesValue =
    operationsOutcome.shares * operationsOutcome.weightedAveragePrice;
  const operationValue = operation.quantity * operation['unit-cost'];
  const totalSharesAfterOperation =
    operationsOutcome.shares + operation.quantity;

  const weightedAveragePrice =
    (totalSharesValue + operationValue) / totalSharesAfterOperation;
  const roundedWeightedAveragePrice =
    roundToTwoDecimalPlaces(weightedAveragePrice);

  return roundedWeightedAveragePrice;
};

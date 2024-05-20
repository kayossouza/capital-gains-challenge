import { Operation } from '../../types/Operation';
import { OperationsOutcome } from '../../types/OperationsOutcome';
import { roundToTwoDecimalPlaces } from '../../utilities/numberUtilities';

/**
 * Handles a sell operation, updating the operations outcome.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param operation The sell operation to be performed.
 * @returns the update outcome after the last operation.
 *
 * This function processes a sell operation, updating the operations outcome.
 * It calculates the total value of the sell operation and the profit made.
 * It then handles three cases:
 * 1. No tax is applied.
 * 2. Profit is made.
 * 3. No profit is made.
 */
export const processSellOperation = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
): OperationsOutcome => {
  const totalValue = calculateTotalValue(operation);
  const profit = calculateProfit(
    operation.quantity,
    operation['unit-cost'],
    operationsOutcome.weightedAveragePrice,
  );

  if (totalValue <= 20000) {
    return handleNoTaxCase(operationsOutcome, operation, profit);
  } else if (profit > 0) {
    return handleProfitCase(operationsOutcome, operation, profit);
  } else {
    return handleNoProfitCase(operationsOutcome, operation, profit);
  }
};

/**
 * Calculates the total value of a sell operation.
 * @param operation The sell operation.
 * @returns The total value of the sell operation.
 */
const calculateTotalValue = (operation: Operation): number => {
  return operation.quantity * operation['unit-cost'];
};

/**
 * Calculates the profit of a sell operation.
 * @param quantity The quantity of shares sold.
 * @param unitCost The unit cost of the shares sold.
 * @param weightedAverage The weighted average price of the shares.
 * @returns The profit of the sell operation.
 *
 * This function calculates the profit of a sell operation.
 * The profit is calculated as the total cost of the shares sold minus the total weighted cost of the shares sold.
 * The total cost is the quantity of shares sold multiplied by the unit cost.
 * The total weighted cost is the quantity of shares sold multiplied by the weighted average price.
 */
const calculateProfit = (
  quantity: number,
  unitCost: number,
  weightedAverage: number,
): number => {
  const totalCost = quantity * unitCost;
  const totalWeightedCost = quantity * weightedAverage;
  return totalCost - totalWeightedCost;
};

/**
 * Handles the case where no tax is applied.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param operation The sell operation to be performed.
 * @returns the update outcome after the last operation.
 *
 * This function handles the case where no tax is applied in the operation.
 * If there is a loss (profit < 0), it adds this loss to the previous loss.
 */
const handleNoTaxCase = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
  profit: number,
): OperationsOutcome => {
  let updatedLoss = operationsOutcome.loss;
  updatedLoss -= profit;
  updatedLoss = updatedLoss > 0 ? updatedLoss : 0; // Loss cannot be negative
  return {
    ...operationsOutcome,
    loss: updatedLoss,
    shares: operationsOutcome.shares - operation.quantity,
    taxes: [...operationsOutcome.taxes, { tax: 0 }],
  };
};

/**
 * Handles the case where profit is made.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param profit The profit made from the sell operation.
 * @returns the update outcome after the last operation.
 *
 * This function handles the case where a profit is made in the operation.
 * If there is a previous loss (operationsOutcome.loss > 0), it deducts this loss from the profit.
 * The updated loss is then either 0 (if the updated profit is greater than 0) or the negative of the updated profit.
 * The tax is then calculated as 20% of the updated profit (if the updated profit is greater than 0).
 */
const handleProfitCase = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
  profit: number,
): OperationsOutcome => {
  let updatedProfit = profit;
  let updatedLoss = operationsOutcome.loss;
  if (operationsOutcome.loss > 0) {
    updatedProfit -= operationsOutcome.loss;
    // Loss cannot be negative, so it is set to 0 if it is negative
    updatedLoss = updatedLoss - profit > 0 ? updatedLoss - profit : 0;
  }
  const tax = updatedProfit <= 0 ? 0 : updatedProfit * 0.2;
  return {
    ...operationsOutcome,
    loss: updatedLoss,
    shares: operationsOutcome.shares - operation.quantity,
    taxes: [...operationsOutcome.taxes, { tax: roundToTwoDecimalPlaces(tax) }],
  };
};

/**
 * Handles the case where no profit is made.
 * @param operationsOutcome The operations outcome after the last operation.
 * @param operation The sell operation to be performed.
 * @param profit The profit made from the sell operation.
 * @returns the update outcome after the last operation.
 *
 * This function handles the case where no profit is made in the operation.
 * It deducts the profit from the previous loss (operationsOutcome.loss) and updates the loss.
 * The updated loss is then either 0 (if the updated loss is greater than 0) or the negative of the updated loss.
 * The function then returns the new operations outcome with the updated loss, shares, and taxes.
 * In this case, the tax is always 0.
 */
const handleNoProfitCase = (
  operationsOutcome: OperationsOutcome,
  operation: Operation,
  profit: number,
): OperationsOutcome => {
  const updatedLoss = operationsOutcome.loss - profit;
  return {
    ...operationsOutcome,
    loss: updatedLoss,
    shares: operationsOutcome.shares - operation.quantity,
    taxes: [...operationsOutcome.taxes, { tax: 0 }],
  };
};

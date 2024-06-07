// import {
//   processAllOperationBatches,
//   clearOperationBatches,
//   addOperationsFromLineToBatch,
// } from '../src/operations/operationProcessing';
// import { printJSON } from '../src/utilities/printUtilities';
// import { isEmptyLine } from '../src/utilities/stringUtilities';
// import { processLine } from '../src/main';
// import readline from 'readline';
// import { operationsProcessingQueue } from '../src/main';
// import { InputLineTask } from '../src/types/InputLineTask';

// import { Operation } from '../src/types/Operation';

// function generateOperationBatches(numBatches: number): Operation[] {
//   const operations: ('buy' | 'sell')[] = ['buy', 'sell'];
//   const operationBatches: Operation[] = [];

//   for (let i = 0; i < numBatches; i++) {
//     const operation = operations[Math.floor(Math.random() * operations.length)];
//     const unitCost = Math.floor(Math.random() * 100) + 1;
//     const quantity = Math.floor(Math.random() * 100000) + 1;

//     operationBatches.push({ operation, 'unit-cost': unitCost, quantity });
//   }

//   return operationBatches;
// }

// jest.mock('../src/utilities/stringUtilities');
// jest.mock('../src/operations/operationProcessing');
// jest.mock('../src/utilities/printUtilities');
// jest.mock('readline', () => {
//   return {
//     createInterface: jest.fn().mockReturnValue({
//       on: jest.fn(),
//     }),
//   };
// });

// describe('processLine', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should process an empty line', async () => {
//     (isEmptyLine as jest.Mock).mockReturnValue(true);
//     const operationsOutcome = [
//       {
//         loss: 0,
//         shares: 0,
//         taxes: [],
//         weightedAveragePrice: 0,
//       },
//     ];
//     (clearOperationBatches as jest.Mock).mockReturnValue([]);
//     (processAllOperationBatches as jest.Mock).mockResolvedValue(
//       operationsOutcome,
//     );
//     const result = await processLine('', []);

//     expect(isEmptyLine).toHaveBeenCalledWith('');
//     expect(processAllOperationBatches).toHaveBeenCalledWith([]);
//     operationsOutcome.forEach((outcome) => {
//       expect(printJSON).toHaveBeenCalledWith(outcome.taxes);
//     });
//     expect(clearOperationBatches).toHaveBeenCalled();
//     expect(result).toEqual([]);
//   });

//   it('should process a non-empty line', async () => {
//     (isEmptyLine as jest.Mock).mockReturnValue(false);
//     const line = `[{ "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
//     { "operation": "sell", "unit-cost": 2.00, "quantity": 5000 },
//     { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
//     { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
//     { "operation": "sell", "unit-cost": 25.00, "quantity": 1000 },
//     { "operation": "buy", "unit-cost": 20.00, "quantity": 10000 },
//     { "operation": "sell", "unit-cost": 15.00, "quantity": 5000 },
//     { "operation": "sell", "unit-cost": 30.00, "quantity": 4350 },
//     { "operation": "sell", "unit-cost": 30.00, "quantity": 650 }]`;

//     const operationBatches = [
//       [
//         { operation: 'buy', 'unit-cost': 10.0, quantity: 10000 },
//         { operation: 'sell', 'unit-cost': 2.0, quantity: 5000 },
//         { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
//         { operation: 'sell', 'unit-cost': 20.0, quantity: 2000 },
//         { operation: 'sell', 'unit-cost': 25.0, quantity: 1000 },
//         { operation: 'buy', 'unit-cost': 20.0, quantity: 10000 },
//         { operation: 'sell', 'unit-cost': 15.0, quantity: 5000 },
//         { operation: 'sell', 'unit-cost': 30.0, quantity: 4350 },
//         { operation: 'sell', 'unit-cost': 30.0, quantity: 650 },
//       ],
//     ];

//     (addOperationsFromLineToBatch as jest.Mock).mockReturnValue(
//       operationBatches,
//     );
//     const result = await processLine(line, []);

//     expect(isEmptyLine).toHaveBeenCalledWith(line);
//     expect(addOperationsFromLineToBatch).toHaveBeenCalledWith(line, []);
//     expect(result).toEqual(operationBatches);
//   });

//   it('should process a line with maximum number of operations', async () => {
//     // Mock isEmptyLine to return false
//     (isEmptyLine as jest.Mock).mockReturnValue(false);

//     const generatedOperationBatches = generateOperationBatches(100);
//     // Create a line with maximum number of operations
//     const line = JSON.stringify(generatedOperationBatches);
//     // Mock addOperationsFromLineToBatch to return a batch with the operations
//     (addOperationsFromLineToBatch as jest.Mock).mockReturnValue(
//       generatedOperationBatches,
//     );

//     // Call processLine
//     const result = await processLine(line, []);

//     expect(isEmptyLine).toHaveBeenCalledWith(line);
//     expect(addOperationsFromLineToBatch).toHaveBeenCalledWith(line, []);
//     expect(result).toEqual(generatedOperationBatches);
//   });
// });

// describe('readlineInterface', () => {
//   it('should add a line to the operationsProcessingQueue when a line is read', () => {
//     const task: InputLineTask = {
//       line: `[{ "operation": "buy", "unit-cost": 20.00, "quantity": 1000 },
//     { "operation": "sell", "unit-cost": 20.00, "quantity": 500 },
//     { "operation": "sell", "unit-cost": 30.00, "quantity": 500 }]`,
//     };
//     const readlineInterface = readline.createInterface as jest.MockedFunction<
//       typeof readline.createInterface
//     >;
//     const mockOn = readlineInterface({
//       input: process.stdin,
//       output: process.stdout,
//     }).on as jest.Mock;

//     // Mock the push method of operationsProcessingQueue.
//     operationsProcessingQueue.push = jest.fn();

//     // Simulate reading a line.
//     mockOn.mockImplementation(
//       (event, callback: (inputLineTask: InputLineTask) => void) => {
//         if (event === 'line') {
//           callback(task);
//         }
//       },
//     );

//     // Call the 'on' method of the readlineInterface with the callback function.
//     mockOn('line', (inputLineTask: InputLineTask) => {
//       operationsProcessingQueue.push(inputLineTask);
//     });

//     expect(operationsProcessingQueue.push).toHaveBeenCalledWith(task);
//   });
// });

// describe('operationsProcessingQueue', () => {
//   it('should process a line of input asynchronously', (done) => {
//     const task: InputLineTask = {
//       line: `[{ "operation": "buy", "unit-cost": 20.00, "quantity": 1000 },
//     { "operation": "sell", "unit-cost": 20.00, "quantity": 500 },
//     { "operation": "sell", "unit-cost": 30.00, "quantity": 500 }]`,
//     };

//     // Mock the push method of operationsProcessingQueue.
//     const mockPush = jest.fn();
//     operationsProcessingQueue.push = mockPush;

//     // Add a console.log statement in the processing function of the queue.
//     operationsProcessingQueue.drain(() => {
//       console.log('All tasks have been processed.');
//       done(); // Call done when all tasks have been processed
//     });

//     operationsProcessingQueue.push(task, () => {});

//     // Expect the push method to have been called with the task and a callback function.
//     // this was tested like this because the function is a callback function
//     // and the only way to test it is to check if it was called
//     expect(mockPush).toHaveBeenCalledWith(task, expect.any(Function));
//     done();
//   });
// });

// describe('addOperationsFromLineToBatch', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it('should add operations from a line to the operation batches', () => {
//     const expectedOperationBatches = [
//       [
//         { operation: 'buy', 'unit-cost': 20.0, quantity: 1000 },
//         { operation: 'sell', 'unit-cost': 20.0, quantity: 500 },
//         { operation: 'sell', 'unit-cost': 30.0, quantity: 500 },
//       ],
//     ];

//     (addOperationsFromLineToBatch as jest.Mock).mockReturnValue(
//       expectedOperationBatches,
//     );

//     const line = `[{ "operation": "buy", "unit-cost": 20.00, "quantity": 1000 },
//         { "operation": "sell", "unit-cost": 20.00, "quantity": 500 },
//         { "operation": "sell", "unit-cost": 30.00, "quantity": 500 }]`;

//     const result = addOperationsFromLineToBatch(line, []);

//     expect(result).toEqual(expectedOperationBatches);
//   });
// });

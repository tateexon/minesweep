# MineSweep

Create a function to generate a minesweeper board. Use a 2d array of numbers. -1 can be bombs, 0 can be empty. Populate the numbers around the bombs.

To run tests run `npm install && npm run test`

To generate a board using these helpers you can run:

    const numberOfBombs: number = 3;
    const rowSize: number = 3;
    const columnSize: number = 3;
    const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
    const testBoard: number[][] = board.GenerateBoard(numberOfBombs, rowSize, columnSize);

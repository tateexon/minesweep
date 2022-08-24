export const EMPTY = 0;
export const BOMB = -1;

/**
 * Helper functions for generating a minesweeper board
 */
export class MineSweepBoardHelpers {
    /**
     * Generates a random number between the min and max, inclusive to both.
     * @param {number} min The smallest random number to generate (inclusive)
     * @param {number} max The largest random number to generate (inclusive)
     * @returns {number} The random number
     */
    public GetRandomNumberBetweenMinAndMaxInclusive(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate a bomb location within the bounds specified
     * @param {number} rowCount The number of rows in the board
     * @param {number} columnCount The number of columns in the board
     * @returns {BombLocation} The generated bomb location
     */
    public GenerateBombLocation(rowCount: number, columnCount: number): BombLocation {
        return {
            x: this.GetRandomNumberBetweenMinAndMaxInclusive(0, rowCount - 1),
            y: this.GetRandomNumberBetweenMinAndMaxInclusive(0, columnCount - 1),
        } as BombLocation;
    }

    /**
     * Generate the wanted number of bomb locations
     * @param {number} count The number of bombs to generate
     * @param {number} rowCount The board row size
     * @param {number} columnCount The board column size
     * @returns {BombLocation[]} The array of bomb locations
     */
    public GenerateBombLocations(count: number, rowCount: number, columnCount: number): BombLocation[] {
        const bombLocations: BombLocation[] = [];
        if (count <= 0) {
            throw new Error("bomb count must be greater than 0");
        }
        if (count === rowCount * columnCount) {
            throw new Error("bombs must be fewer than all board spaces");
        }
        for (let i = 0; i < count; i++) {
            let location: BombLocation = this.GenerateBombLocation(rowCount, columnCount);
            while (bombLocations.some(e => e.x === location.x && e.y === location.y)) {
                location = this.GenerateBombLocation(rowCount, columnCount);
            }
            bombLocations.push(location);
        }
        return bombLocations;
    }

    /**
     * Initializes an empty board with the number of rows and columns provided
     * @param {number} rowCount The number of rows
     * @param {number} columnCount The number of columns
     * @returns {number[][]} The 2d number array of the wanted size all initialized to emtpy spaces
     */
    public InitializeEmptyBoard(rowCount: number, columnCount: number): number[][] {
        const board: number[][] = [];
        for (let x = 0; x < rowCount; x++) {
            board.push([]);
            for (let y = 0; y < columnCount; y++) {
                board[x].push(EMPTY);
            }
        }
        return board;
    }

    /**
     * Increase the number on all 8 spaces around the bomb
     * @param {BombLocation} bomb The location of the bomb
     * @param {number[][]} board The board to update
     * @returns {number[][]} The updated board
     */
    public SetNumbersAroundBomb(bomb: BombLocation, board: number[][]): number[][] {
        /* tslint:disable no-empty */
        // set all spaces around the bomb and catch array index out of bounds errors instead of adding extra logic
        // top left
        try {
            if (board[bomb.x - 1][bomb.y - 1] >= EMPTY) {
                board[bomb.x - 1][bomb.y - 1]++;
            }
        } catch (e) {}
        // middle left
        try {
            if (board[bomb.x - 1][bomb.y] >= EMPTY) {
                board[bomb.x - 1][bomb.y]++;
            }
        } catch (e) {}
        // bottom left
        try {
            if (board[bomb.x - 1][bomb.y + 1] >= EMPTY) {
                board[bomb.x - 1][bomb.y + 1]++;
            }
        } catch (e) {}

        // top middle
        try {
            if (board[bomb.x][bomb.y - 1] >= EMPTY) {
                board[bomb.x][bomb.y - 1]++;
            }
        } catch (e) {}
        // bottom middle
        try {
            if (board[bomb.x][bomb.y + 1] >= EMPTY) {
                board[bomb.x][bomb.y + 1]++;
            }
        } catch (e) {}

        // top right
        try {
            if (board[bomb.x + 1][bomb.y - 1] >= EMPTY) {
                board[bomb.x + 1][bomb.y - 1]++;
            }
        } catch (e) {}
        // middle right
        try {
            if (board[bomb.x + 1][bomb.y] >= EMPTY) {
                board[bomb.x + 1][bomb.y]++;
            }
        } catch (e) {}
        // bottom right
        try {
            if (board[bomb.x + 1][bomb.y + 1] >= EMPTY) {
                board[bomb.x + 1][bomb.y + 1]++;
            }
        } catch (e) {}
        /* tslint:enable no-empty */
        return board;
    }

    /**
     * Place all the bombs on the board
     * @param {BombLocation[]} bombLocations The locations to place bombs on the board
     * @param {number[][]} board The board to update
     * @returns {number[][]} The updated board
     */
    public PlaceBombs(bombLocations: BombLocation[], board: number[][]): number[][] {
        bombLocations.forEach(bomb => {
            // set bomb
            board[bomb.x][bomb.y] = BOMB;
            // update numbers
            board = this.SetNumbersAroundBomb(bomb, board);
        });
        return board;
    }

    /**
     * Generates a board of the wanted size with the number of wanted bombs and all the numbers around the bombs populate correctly
     * @param {number} bombCount The number of bombs wanted
     * @param {number} rowCount The number of rows wanted
     * @param {number} columnCount The number of columns wanted
     * @returns {number[][]} The 2d number array with bombs and numbers populated
     */
    public GenerateBoard(bombCount: number, rowCount: number, columnCount: number): number[][] {
        // initialize board
        let board: number[][] = this.InitializeEmptyBoard(rowCount, columnCount);

        // generate bomb locations
        const bombLocations: BombLocation[] = this.GenerateBombLocations(bombCount, rowCount, columnCount);

        // place bombs and update the numbers around them
        board = this.PlaceBombs(bombLocations, board);
        return board;
    }
}

/**
 * Interface to simplify bomb locations
 */
export interface BombLocation {
    x: number;
    y: number;
}

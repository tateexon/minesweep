import { expect } from "chai";
import * as sinon from "sinon";
import "mocha";
import { MineSweepBoardHelpers, BOMB, BombLocation, EMPTY } from "../src/MineSweepBoardHelpers";

describe("Tests for the Board object @unit", function (): void {
    afterEach(() => {
        sinon.restore();
    });
    it("verifies GetRandomNumberBetweenMinAndMaxInclusive returns a number between min and max", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const value = board.GetRandomNumberBetweenMinAndMaxInclusive(1, 1);
        expect(value).to.eq(1, "it is inclusive this should always be 1");
    });
    it("verifies GetBomb returns a bomb location between the expected row and column", async function (): Promise<void> {
        sinon.stub(MineSweepBoardHelpers.prototype, "GetRandomNumberBetweenMinAndMaxInclusive").callsFake((min: number, max: number): number => {
            return 1;
        });
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const location: BombLocation = board.GenerateBombLocation(1, 2);
        expect(location.x).to.eq(1, "should be set to one since the mock is set to 1");
        expect(location.y).to.eq(1, "should be set to one since the mock is set to 1");
    });
    it("verifies GetBombs returns the correct number of bombs and no duplicates", async function (): Promise<void> {
        const bombCount: number = 3;
        const boardSideSize: number = 2;
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        // run this test multiple times since it could have the potential for a false positive to less than 0.1%
        for (let i = 0; i < 1000; i++) {
            const locations: BombLocation[] = board.GenerateBombLocations(bombCount, boardSideSize, boardSideSize);
            // check number of bombs
            expect(locations.length).to.eq(bombCount, "should have 3 bombs set");
            // check if there are any duplicates
            expect(locations[0].x === locations[1].x && locations[0].y === locations[1].y).to.not.eq(true, `no duplicates ${JSON.stringify(locations)}`);
            expect(locations[0].x === locations[2].x && locations[0].y === locations[2].y).to.not.eq(true, `no duplicates ${JSON.stringify(locations)}`);
            expect(locations[1].x === locations[2].x && locations[1].y === locations[2].y).to.not.eq(true, `no duplicates ${JSON.stringify(locations)}`);
        }
    });
    it("verifies we can initialize an empty board", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const value = board.InitializeEmptyBoard(1, 2);
        expect(value.length).to.eq(1, "should only have 1 row");
        expect(value[0].length).to.eq(2, "should only have 2 columns");
        expect(value[0][0]).to.eq(EMPTY, "board entry should b empty which is 0");
        expect(value[0][1]).to.eq(EMPTY, "board entry should b empty which is 0");
    });
    it("verifies we can set values around a bomb on all sides", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const bombLocation: BombLocation = {
            x: 1,
            y: 1,
        };
        let testBoard: number[][] = [
            [0, 0, 0],
            [0, BOMB, 0],
            [0, 0, 0],
        ];
        testBoard = board.SetNumbersAroundBomb(bombLocation, testBoard);
        expect(testBoard[0][0]).to.eq(1, "should be 1 here");
        expect(testBoard[0][1]).to.eq(1, "should be 1 here");
        expect(testBoard[0][2]).to.eq(1, "should be 1 here");
        expect(testBoard[1][0]).to.eq(1, "should be 1 here");
        expect(testBoard[1][1]).to.eq(BOMB, "should still be a bomb");
        expect(testBoard[1][2]).to.eq(1, "should be 1 here");
        expect(testBoard[2][0]).to.eq(1, "should be 1 here");
        expect(testBoard[2][1]).to.eq(1, "should be 1 here");
        expect(testBoard[2][2]).to.eq(1, "should be 1 here");
    });

    it("verifies we can set values around a bomb in top right corner", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const bombLocation: BombLocation = {
            x: 0,
            y: 0,
        };
        let testBoard: number[][] = [
            [BOMB, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        testBoard = board.SetNumbersAroundBomb(bombLocation, testBoard);
        expect(testBoard[0][0]).to.eq(BOMB, "should still be a bomb");
        expect(testBoard[0][1]).to.eq(1, "should be 1 here");
        expect(testBoard[0][2]).to.eq(EMPTY, "should be empt here");
        expect(testBoard[1][0]).to.eq(1, "should be 1 here");
        expect(testBoard[1][1]).to.eq(1, "should be 1 here");
        expect(testBoard[1][2]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[2][0]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[2][1]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[2][2]).to.eq(EMPTY, "should be empty here");
    });
    // checking the bottom right checks for out of bounds for both the row and column arrays for greater than there counts
    it("verifies we can set values around a bomb in bottom right corner", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const bombLocation: BombLocation = {
            x: 2,
            y: 2,
        };
        let testBoard: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, BOMB],
        ];
        testBoard = board.SetNumbersAroundBomb(bombLocation, testBoard);
        expect(testBoard[0][0]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[0][1]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[0][2]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[1][0]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[1][1]).to.eq(1, "should be 1 here");
        expect(testBoard[1][2]).to.eq(1, "should be 1 here");
        expect(testBoard[2][0]).to.eq(EMPTY, "should be empty here");
        expect(testBoard[2][1]).to.eq(1, "should be 1 here");
        expect(testBoard[2][2]).to.eq(BOMB, "should still be a bomb");
    });

    it("verifies we can set values around multiple bombs", async function (): Promise<void> {
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const bombLocations: BombLocation[] = [
            { x: 2, y: 2 },
            { x: 1, y: 1 },
            { x: 2, y: 0 },
        ];
        let testBoard: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        testBoard = board.PlaceBombs(bombLocations, testBoard);
        expect(testBoard[0][0]).to.eq(1, "should be 1 here");
        expect(testBoard[0][1]).to.eq(1, "should be 1 here");
        expect(testBoard[0][2]).to.eq(1, "should be 1 here");
        expect(testBoard[1][0]).to.eq(2, "should be 2 here");
        expect(testBoard[1][1]).to.eq(BOMB, "should still be a bomb");
        expect(testBoard[1][2]).to.eq(2, "should be 1 here");
        expect(testBoard[2][0]).to.eq(BOMB, "should still be a bomb");
        expect(testBoard[2][1]).to.eq(3, "should be 3 here");
        expect(testBoard[2][2]).to.eq(BOMB, "should still be a bomb");
    });

    it("verifies we can generate a board end to end", async function (): Promise<void> {
        sinon.stub(MineSweepBoardHelpers.prototype, "GetRandomNumberBetweenMinAndMaxInclusive").callsFake((min: number, max: number): number => {
            return 1;
        });
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        const testBoard: number[][] = board.GenerateBoard(1, 2, 2);
        expect(testBoard.length).to.eq(2);
        expect(testBoard[0].length).to.eq(2);

        expect(testBoard[0][0]).to.eq(1, "should be 1 here");
        expect(testBoard[0][1]).to.eq(1, "should be 1 here");
        expect(testBoard[1][0]).to.eq(1, "should be 1 here");
        expect(testBoard[1][1]).to.eq(BOMB, "should a bomb");
    });

    it("should throw an error if invalid parameters are input for bombCount, rowCount, or columnCount", async function (): Promise<void> {
        /* tslint:disable no-empty */
        let errorFound: boolean = false;
        const board: MineSweepBoardHelpers = new MineSweepBoardHelpers();
        try {
            board.GenerateBoard(1.1, 2, 2);
            errorFound = true;
        } catch (e) {}
        expect(errorFound).to.eq(false, "did not throw an expected error when invalid bombCount was input");

        try {
            board.GenerateBoard(1, -2, 2);
            errorFound = true;
        } catch (e) {}
        expect(errorFound).to.eq(false, "did not throw an expected error when invalid rowCount was input");

        try {
            board.GenerateBoard(1, 2, 2.2);
            errorFound = true;
        } catch (e) {}
        expect(errorFound).to.eq(false, "did not throw an expected error when invalid columnCount was input");

        try {
            board.GenerateBoard(4, 2, 2);
            errorFound = true;
        } catch (e) {}
        expect(errorFound).to.eq(
            false,
            "did not throw an expected error when total number of bombs was equal to or greater than the total number of board spaces",
        );
        /* tslint:enable no-empty */
    });
});

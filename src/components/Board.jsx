import Tile from "./Tile";
import { useState } from "react";

const directions = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
  [-1, -1], // Up-Left
  [-1, 1], //  Up-right
  [1, -1], // down-left
  [1, 1], // doen right
];

const createBoard = () => {
  let board = [];
  for (let row = 0; row < 8; row++) {
    let row = [];
    for (let col = 0; col < 8; col++) {
      row.push(null);
    }
    board.push(row);
  }
  board[3][3] = "W";
  board[3][4] = "B";
  board[4][3] = "B";
  board[4][4] = "W";
  return board;
};

const Board = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState("W");
  const [opponentPlayer, setOpponentPlayer] = useState("B");
  const [gameOver, setGameOver] = useState(false);

  const isValidMove = (row, col) => {
    // Check if the cell at the given coordinates is already occupied
    if (board[row][col] !== null) return false;

    // Iterate over the directions array
    for (let [dx, dy] of directions) {
      // Start from the cell next to the current cell
      let x = row + dx,
        y = col + dy;

      // Continue as long as the cell is within the board boundaries and is occupied by the opponent's piece
      if (
        x >= 0 &&
        x < 8 &&
        y >= 0 &&
        y < 8 &&
        board[x][y] === opponentPlayer
      ) {
        // Check the cells in the current direction
        while (x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8) {
          x += dx;
          y += dy;

          // If a cell is occupied by the current player's piece, return true
          if (board[x][y] === currentPlayer) return true;

          // If an empty cell is encountered, break the loop
          if (board[x][y] === null) break;
        }
      }
    }

    // If no valid moves are found, return false
    return false;
  };

  const flipPieces = (row, col) => {
    // Iterate over the directions array
    for (let [dx, dy] of directions) {
      // Start from the cell next to the current cell
      let x = row + dx,
        y = col + dy,
        flip = []; // Array to store the coordinates of the opponent's pieces that are potentially trapped

      // Continue as long as the cell is within the board boundaries and is occupied by the opponent's piece
      while (
        x >= 0 &&
        x < 8 &&
        y >= 0 &&
        y < 8 &&
        board[x][y] === opponentPlayer
      ) {
        // Add the coordinates of the opponent's piece to the flip array in the current direction
        flip.push([x, y]);
        x += dx;
        y += dy;
      }

      // If the cell is within the board boundaries and is occupied by the current player's piece
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === currentPlayer) {
        // Flip the opponent's pieces that are trapped between two of the current player's pieces
        for (let [x, y] of flip) board[x][y] = currentPlayer;
      }
    }
  };

  const handleOnClick = (row, col) => {
    console.log("row", row, "col", col);
    if (!isValidMove(row, col)) return;
    let boardCopy = [...board];
    boardCopy[row][col] = currentPlayer;
    setBoard(boardCopy);
    flipPieces(row, col);

    // Switch players
    setCurrentPlayer(opponentPlayer);
    setOpponentPlayer(currentPlayer);

    // Check if all tiles are occupied
    const isBoardFull = boardCopy.every((row) =>
      row.every((tile) => tile !== null)
    );

    // Check if the current player has no valid moves left
    const currentPlayerHasNoValidMoves = boardCopy.every((row, rowIndex) =>
      row.every((tile, colIndex) => !isValidMove(rowIndex, colIndex))
    );

    // Switch players again to check if the opponent has valid moves
    setCurrentPlayer(opponentPlayer);
    setOpponentPlayer(currentPlayer);

    // Check if the opponent has no valid moves left
    const opponentPlayerHasNoValidMoves = boardCopy.every((row, rowIndex) =>
      row.every((tile, colIndex) => !isValidMove(rowIndex, colIndex))
    );

    // Switch players back to the original state
    setCurrentPlayer(opponentPlayer);
    setOpponentPlayer(currentPlayer);

    if (
      isBoardFull ||
      currentPlayerHasNoValidMoves ||
      opponentPlayerHasNoValidMoves
    ) {
      setGameOver(true);
    }
  };

  return (
    <>
      {gameOver && <h1>Game Over</h1>}
      <div
        style={{
          width: "656px",
          height: "656px",
          margin: "auto",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {board.map((row, rowIndex) => {
          return row.map((tile, colIndex) => {
            return (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                tileValue={tile}
                row={rowIndex}
                col={colIndex}
                onClick={() => handleOnClick(rowIndex, colIndex)}
              />
            );
          });
        })}
      </div>
    </>
  );
};

export default Board;

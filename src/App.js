import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Row({ rowNumber, squares, clickHandler }) {
  const row = [rowNumber * 3, rowNumber * 3 + 1, rowNumber * 3 + 2].map(
    (index, i) => {
      return (
        <Square
          value={squares[index]}
          onSquareClick={() => clickHandler(index)}
        />
      );
    }
  );

  return <div className="board-row">{row}</div>;
}

function Rows({ squares, clickHandler }) {
  return [0, 1, 2].map((index, i) => {
    return (
      <Row rowNumber={index} squares={squares} clickHandler={clickHandler} />
    );
  });
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(index) {
    if (!calculateWinner(squares) && !squares[index]) {
      const nextSquares = squares.slice();
      nextSquares[index] = xIsNext ? "X" : "O";
      onPlay(nextSquares);
    }
  }

  const winner = calculateWinner(squares);
  let status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      <Rows squares={squares} clickHandler={handleClick} />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    if (move === currentMove) {
      return (
        <li key={move}>
          <span>Currnet move: {move + 1}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>Go to move {move + 1}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game=info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
}

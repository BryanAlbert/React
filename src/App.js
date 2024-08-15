import { useState } from "react";

const Row = ({ rowNumber, squares, three, clickHandler }) => {
  const row = [rowNumber * 3, rowNumber * 3 + 1, rowNumber * 3 + 2].map(
    (index, i) => {
      return (
        <button
          className="square"
          key={index}
          onClick={() => clickHandler(index)}
          style={{
            background:
              three && three.some((x) => x === index) ? "#f55" : "#fff",
          }}
        >
          {squares[index]}
        </button>
      );
    }
  );

  return <div className="board-row">{row}</div>;
};

const Rows = ({ squares, three, clickHandler }) => {
  return [0, 1, 2].map((index, i) => {
    return (
      <Row
        key={index}
        rowNumber={index}
        squares={squares}
        three={three}
        clickHandler={clickHandler}
      />
    );
  });
};

const Board = ({ xIsNext, squares, onMove }) => {
  const handleClick = (index) => {
    if (!calculateWinner(squares) && !squares[index]) {
      const nextSquares = squares.slice();
      nextSquares[9] = index;
      nextSquares[index] = xIsNext ? "X" : "O";
      onMove(nextSquares);
    }
  };

  const three = calculateWinner(squares);
  let status = three
    ? "Winner: " + squares[three[0]]
    : !squares.some((x) => !x)
    ? "Draw"
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      <Rows squares={squares} three={three} clickHandler={handleClick} />
    </>
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortDown, setSortDown] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handleMove = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(sortDown ? nextMove : history.length - nextMove - 1);
  };

  const changeSort = () => {
    setSortDown(!sortDown);
  };

  const undo = (redo) => {
    console.log(`undo with ${redo}`);
    if (redo) {
      if (currentMove > 0) setCurrentMove(currentMove - 1);
    } else {
      if (currentMove < history.length - 1) setCurrentMove(currentMove + 1);
    }
  };

  const ordered = sortDown ? history : history.slice().reverse();
  const moves = ordered.map((squares, index) => {
    const move = sortDown ? index : history.length - index - 1;
    let line = `${move}: ${squares[squares[9]]} at (${
      Math.floor(squares[9] / 3) + 1
    }, ${(squares[9] % 3) + 1})`;
    line =
      move == 0
        ? "Start"
        : calculateWinner(squares) === null
        ? `Move ${line}`
        : `Final move ${line}`;
    if (move !== currentMove) {
      return (
        <li key={move}>
          <button style={{ margin: "1px" }} onClick={() => jumpTo(index)}>
            {line}
          </button>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <span className="current-line">{line}</span>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onMove={handleMove} />
      </div>
      <div className="game-info">
        <div>
          <button
            className="undo-button"
            onClick={() => undo(true)}
            disabled={currentMove === 0}
          >
            Undo
          </button>
          <button
            className="undo-button"
            onClick={() => undo(false)}
            disabled={currentMove === history.length - 1}
          >
            Redo
          </button>
        </div>
        <label className="sort-label">
          <input type="checkbox" checked={sortDown} onChange={changeSort} />{" "}
          Sort descending
        </label>
        <ul className="move-list">{moves}</ul>
      </div>
    </div>
  );
}

const calculateWinner = (squares) => {
  const threes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < threes.length; i++) {
    const [a, b, c] = threes[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return threes[i];
  }

  return null;
};

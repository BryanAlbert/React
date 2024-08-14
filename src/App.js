import { useState } from "react";

const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

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

const Board = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (index) => {
    if (!calculateWinner(squares) && !squares[index]) {
      const nextSquares = squares.slice();
      nextSquares[index] = xIsNext ? "X" : "O";
      onPlay(nextSquares);
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
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortDown, setSortDown] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
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

  const moves = history.map((squares, index) => {
    const move = sortDown ? index : history.length - index - 1;
    if (move === currentMove) {
      return (
        <li key={move}>
          <span className="status">Currnet move: {move + 1}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button style={{ margin: "1px" }} onClick={() => jumpTo(index)}>
            Go to move {move + 1}
          </button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <label className="sort-button">
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

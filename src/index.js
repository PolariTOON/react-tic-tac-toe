const size = 3;
const length = size ** 2;
const noPlayer = "";
const players = ["O", "X"];
function calcSize() {
  return size;
}
function calcLength() {
  return length;
}
function calcNoPlayer() {
  return noPlayer;
}
function calcPlayer(step) {
  return players[step % players.length];
}
function isWinner(squares, player) {
  const size = calcSize();
  rows: for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (squares[i * size + j] !== player) {
        continue rows;
      }
    }
    return true;
  }
  columns: for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (squares[j * size + i] !== player) {
        continue columns;
      }
    }
    return true;
  }
  diagonals: for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < size; ++j) {
      if (squares[(i + j) * (size + 1 - i * 2)] !== player) {
        continue diagonals;
      }
    }
    return true;
  }
  return false;
}
function Status({status, clear, undo, redo}) {
  const {step, winner} = status;
  const data = winner ? (
    `Winner: ${calcPlayer(step)}`
  ) : step === calcLength() ? (
    "No winner..."
  ) : (
    `Turn: ${calcPlayer(step + 1)}`
  );
  return (
    <div className="status">
      <p>{data}</p>
      <menu>
        <li>
          <button onClick={() => clear()}>Clear</button>
        </li>
        <li>
          <button onClick={() => undo()}>Undo</button>
        </li>
        <li>
          <button onClick={() => redo()}>Redo</button>
        </li>
      </menu>
    </div>
  );
}
function Board({board, fill}) {
  const size = calcSize();
  const {squares} = board;
  const cells = [];
  for (const [index, player] of squares.entries()) {
    cells.push(
      <li key={index}>
        <button onClick={() => fill(index)}>{player}</button>
      </li>
    );
  }
  return (
    <div className="board">
      <ol style={{"--size": size}}>{cells}</ol>
    </div>
  );
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    const step = 0;
    const length = calcLength();
    const noPlayer = calcNoPlayer();
    const squares = Array.from({length}).fill(noPlayer);
    const winner = false;
    const history = [{squares, winner}];
    this.state = {step, history};
  }
  render() {
    const {step, history} = this.state;
    const {squares, winner} = history[step];
    const status = {step, winner};
    const board = {squares};
    return (
      <div>
        <Status status={status} clear={() => this.clear()} undo={() => this.undo()} redo={() => this.redo()}/>
        <Board board={board} fill={(index) => this.fill(index)}/>
      </div>
    );
  }
  fill(index) {
    const {step, history} = this.state;
    const {squares, winner} = history[step];
    const noPlayer = calcNoPlayer();
    if (winner || squares[index] !== noPlayer) {
      return;
    }
    const nextStep = step + 1;
    const nextSquares = squares.slice();
    const nextPlayer = calcPlayer(nextStep);
    nextSquares[index] = nextPlayer;
    const nextWinner = isWinner(nextSquares, nextPlayer);
    const nextHistory = history.slice(0, nextStep);
    nextHistory.push({squares: nextSquares, winner: nextWinner});
    this.setState({step: nextStep, history: nextHistory});
  }
  clear() {
    const {history} = this.state;
    const nextStep = 0;
    const nextHistory = history.slice(0, 1);
    this.setState({step: nextStep, history: nextHistory});
  }
  undo() {
    const {step, history} = this.state;
    if (step === 0) {
      return;
    }
    const nextStep = step - 1;
    const nextHistory = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
  redo() {
    const {step, history} = this.state;
    if (step + 1 === history.length) {
      return;
    }
    const nextStep = step + 1;
    const nextHistory = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
}
ReactDOM.render(<Game/>, document.querySelector("#root"));
navigator.serviceWorker.register("./service-worker.js", {scope: "./"});

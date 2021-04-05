/** Connect Four
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
startBtn = document.querySelector('button');
startBtn.addEventListener('click', (e) => { 
  e.preventDefault();
  
  const p1Input = document.querySelector("input[name='p1']");
  const p2Input = document.querySelector("input[name='p2']");
  const playerOne = new Player(p1Input.name, p1Input.value);
  const playerTwo = new Player(p2Input.name, p2Input.value);
  document.querySelector('form').remove();

  var four = new Game(6, 7, [playerOne, playerTwo]);
});



class Game {
  constructor(height, width, playersArr) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.board = this.makeBoard(); // array of rows, each row is array of cells  (board[y][x])
    
    this.players = playersArr;
    this.currPlayer = this.players[0];
    
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  
  // makeBoard: create in-JS board structure:
  // board = array of rows, each row is array of cells  (board[y][x])
  makeBoard() {
    let board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      board.push(Array.from({ length: this.WIDTH }));
    }
    return board;
  }
  
  // /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  
  /** placeInTable: update DOM to place piece into HTML table of board */
  
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`${this.currPlayer['player']}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer['color']
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  /** endGame: announce game end */
  
  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }
  
  /** handleClick: handle click of column top to play piece */
  
  handleClick(evt) {
    if (!this.gameOver) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer['player'];
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer['player']} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame("Tie!");
      }
        
      // switch players
      this.currPlayer =
        this.currPlayer === this.players[0]
          ? this.players[1]
          : this.players[0];
    }
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
  checkForWin() {
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to winc
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (
          this._checkForWinCells(horiz) ||
          this._checkForWinCells(vert) ||
          this._checkForWinCells(diagDR) ||
          this._checkForWinCells(diagDL)
        ) {
          return true;
        }
      }
    }
  }

  _checkForWinCells(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer['player']
    );
  }
}

class Player {
  constructor(player, color) {
    this.player = player;
    this.color = color;
  }
}
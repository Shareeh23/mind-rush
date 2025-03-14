let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll('.cell'); // Select all cells in the table
const proceedBtn = document.querySelector('proceed-btn'); // Select the Next Game button
const resultMessage = document.querySelector('.computer-response-text'); // Select message display element

startGame();

function startGame() {
  origBoard = Array.from(Array(9).keys()); // Initialize the game board
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = ''; // Clear cell content
    cells[i].style.removeProperty('background-color'); // Remove any background color
    cells[i].addEventListener('click', turnClick, false); // Attach event listener to each cell
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer); // Human turn
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer); // AI turn
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player; // Set text to player mark ('X' or 'O')
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon); // End the game if there is a winner
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? 'blue' : 'red';
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  let result = gameWon.player == huPlayer ? 'win' : 'lose';
  localStorage.setItem('result', result);
  
  // Call a function to update UI immediately
  updateUIBasedOnResult();
  
  return result;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == 'number'); // Return available squares (unfilled)
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index; // AI chooses the best spot using minimax
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', turnClick, false);
    }
    localStorage.setItem('result', 'tie');
    
    // Call a function to update UI immediately
    updateUIBasedOnResult();
    
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptySquares();
  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 }; // If the human wins, return a negative score
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 }; // If the AI wins, return a positive score
  } else if (availSpots.length === 0) {
    return { score: 0 }; // If it's a tie, return a score of 0
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer); // AI's turn (minimax)
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer); // Human's turn (minimax)
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index; // Reset the board
    moves.push(move);
  }
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

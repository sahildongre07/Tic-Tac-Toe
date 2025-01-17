const board = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const winnerMessage = document.getElementById("winner");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameMode = "pvp";

// Initialize board
function createBoard() {
  board.innerHTML = "";
  gameBoard.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.textContent = cell;
    board.appendChild(cellDiv);
  });
}

// Handle Player Click
function handleClick(event) {
  const index = event.target.dataset.index;

  // Prevent overwriting
  if (!gameBoard[index] && !winnerMessage.textContent) {
    gameBoard[index] = currentPlayer;
    updateBoard();
    if (checkWinner()) return;

    // Switch Player or trigger AI move
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (gameMode === "ai" && currentPlayer === "O") {
      setTimeout(aiMove, 500); // AI Move with slight delay
    }
  }
}

// Simple AI Logic: Random Move
function aiMove() {
  const emptyCells = gameBoard
    .map((cell, index) => (cell === "" ? index : null))
    .filter(index => index !== null);

  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomIndex] = "O";
    updateBoard();
    if (checkWinner()) return;

    currentPlayer = "X";
  }
}

// Update UI
function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = gameBoard[index];
    cell.classList.toggle("taken", gameBoard[index] !== "");
  });
}

// Check Winner or Draw
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      winnerMessage.textContent = `Player ${gameBoard[a]} Wins!`;
      board.removeEventListener("click", handleClick);
      return true;
    }
  }

  if (!gameBoard.includes("")) {
    winnerMessage.textContent = "It's a Draw!";
    return true;
  }
  return false;
}

// Restart Game
function restartGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  winnerMessage.textContent = "";
  createBoard();
  board.addEventListener("click", handleClick);
}

// Event Listeners
restartBtn.addEventListener("click", restartGame);
modeSelect.addEventListener("change", (e) => {
  gameMode = e.target.value;
  restartGame();
});

// Initialize
restartGame();
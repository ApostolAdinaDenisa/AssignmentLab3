const words = [
  "table", "chair", "piano", "mouse", "house",
  "plant", "brain", "cloud", "beach", "fruit"
];

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const message = document.getElementById("message");
const newGameBtn = document.getElementById("newGameBtn");
const statsEl = document.getElementById("stats");

let targetWord = "";
let currentRow = 0;
let gameOver = false;

let stats = {
  played: 0,
  wins: 0,
  streak: 0
};

// RANDOM WORD (NORMALIZAT)
function randomWord() {
  return words[Math.floor(Math.random() * words.length)]
    .trim()
    .toUpperCase();
}

// CREATE BOARD
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

// UPDATE STATS
function updateStats() {
  const winPercent = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0;

  statsEl.textContent =
    `Games: ${stats.played} | Win %: ${winPercent} | Streak: ${stats.streak}`;
}

// START GAME
function startGame() {
  targetWord = randomWord();
  currentRow = 0;
  gameOver = false;
  input.value = "";
  message.textContent = "";
  newGameBtn.style.display = "none";

  createBoard();
  updateStats();
}

// WORDLE LOGIC
function checkGuess(guess) {
  const result = Array(5).fill("absent");
  const targetArr = targetWord.split("");

  // corect (verde)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetArr[i]) {
      result[i] = "correct";
      targetArr[i] = null;
    }
  }

  // prezent (galben)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "absent") {
      const index = targetArr.indexOf(guess[i]);
      if (index !== -1) {
        result[i] = "present";
        targetArr[index] = null;
      }
    }
  }

  return result;
}

// SUBMIT GUESS
function submitGuess() {
  if (gameOver) return;

  const guess = input.value.trim().toUpperCase();

  if (guess.length !== 5) {
    message.textContent = "Enter exactly 5 letters.";
    return;
  }

  message.textContent = "";

  const row = board.children[currentRow];
  const feedback = checkGuess(guess);

  [...row.children].forEach((cell, i) => {
    cell.textContent = guess[i];
    setTimeout(() => {
      cell.classList.add("flip", feedback[i]);
    }, i * 100);
  });

  // WIN
  if (guess === targetWord) {
    stats.played++;
    stats.wins++;
    stats.streak++;
    gameOver = true;

    alert("You won!");
    newGameBtn.style.display = "block";
    updateStats();
    return;
  }

  currentRow++;

  // LOSE
  if (currentRow === 6) {
    stats.played++;
    stats.streak = 0;
    gameOver = true;

    alert(`You lost! The word was: ${targetWord}`);
    newGameBtn.style.display = "block";
    updateStats();
  }

  input.value = "";
}

// EVENTS
document.getElementById("guessBtn").addEventListener("click", submitGuess);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitGuess();
});

newGameBtn.addEventListener("click", startGame);

// INIT
startGame();

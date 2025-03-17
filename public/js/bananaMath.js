// Constants and DOM elements
const API_URL = 'https://marcconrad.com/uob/banana/api.php';
const puzzleDisplay = document.getElementById('puzzleDisplay');
const solutionInput = document.getElementById('solutionInput');
const submitButton = document.getElementById('submitButton');
const messageDisplay = document.getElementById('messageDisplay');
let currentPuzzle = null;
let puzzleCount = 0;
const MAX_PUZZLES = 3;

// Initialize the game
function initGame() {
  localStorage.removeItem('result');

  // Set up event listeners
  submitButton.addEventListener('click', checkSolution);
  solutionInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkSolution();
    }
  });

  fetchNewPuzzle();
}

// Fetch a new puzzle
async function fetchNewPuzzle() {
  try {
    solutionInput.value = '';

    if (messageDisplay) {
      messageDisplay.textContent = '';
    }

    const timestamp = Date.now();
    const response = await fetch(`${API_URL}?cb=${timestamp}`); // append the timestamp to prevent caching issues

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Puzzle data received:", data);

    if (!data || !data.question || data.solution === undefined) {
      throw new Error("Invalid puzzle data format");
    }

    currentPuzzle = data;

    // Create image element
    const img = document.createElement('img');
    img.src = data.question;
    img.alt = "Puzzle Image";
    img.className = "puzzle-image";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";

    img.onload = function() {
      puzzleDisplay.textContent = '';
      puzzleDisplay.appendChild(img);

      if (messageDisplay) {
        messageDisplay.textContent = `Question ${puzzleCount + 1} of ${MAX_PUZZLES}`;
      }

      solutionInput.focus();
    };
  } catch (error) {
    console.error("Error fetching puzzle:", error);
  }
}

// Check user solution
function checkSolution() {
  if (!currentPuzzle) {
    console.error("No active puzzle");
    return;
  }

  const userSolution = parseInt(solutionInput.value.trim());

  if (isNaN(userSolution)) {
    if (messageDisplay) {
      messageDisplay.textContent = 'Please enter a valid number';
    }
    return;
  }

  console.log(`Checking solution: user=${userSolution}, correct=${currentPuzzle.solution}`);

  if (userSolution === currentPuzzle.solution) {
    puzzleCount++;
    console.log(`Correct! Solved ${puzzleCount}/${MAX_PUZZLES}`);

    if (puzzleCount < MAX_PUZZLES) {
      if (messageDisplay) {
        messageDisplay.textContent = `Correct! Loading next puzzle...`;
      }
      setTimeout(fetchNewPuzzle, 1000);
    } else {
      endGame();
    }
  } else {
    console.log("Incorrect answer");

    // Update localStorage to store the "lose" result when incorrect
    localStorage.setItem('result', 'lose');

    if (messageDisplay) {
      messageDisplay.textContent = 'Incorrect. Try again!';
    }

    document.dispatchEvent(new CustomEvent('gameOver', { detail: { result: 'lose' } }));

    solutionInput.value = '';
    solutionInput.focus();
  }
}

// End the game
function endGame() {
  console.log("Game completed successfully!");

  localStorage.setItem('result', 'win');

  document.dispatchEvent(new CustomEvent('gameOver', { detail: { result: 'win' } }));
  
  puzzleDisplay.innerHTML = `
    <div class="completion-message">
      <h2>Congratulations!</h2>
      <p>You're Math Wizard!</p>
    </div>
  `;

  if (messageDisplay) {
    messageDisplay.textContent = 'All questions are completed!';
  }

  solutionInput.disabled = true;
  submitButton.disabled = true;
}

// Start game on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing game");
  setTimeout(initGame, 100);
});

// Expose functions globally
window.fetchNewPuzzle = fetchNewPuzzle;
window.checkSolution = checkSolution;
window.endGame = endGame;

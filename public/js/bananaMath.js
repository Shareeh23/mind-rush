// Constants and DOM elements
const API_URL = 'https://www.sanfoh.com/uob/banana/api.php'; // Adjusted API URL if necessary
const puzzleDisplay = document.getElementById('puzzleDisplay');
const solutionInput = document.getElementById('solutionInput');
const submitButton = document.getElementById('submitButton');
const messageDisplay = document.getElementById('messageDisplay');
let currentPuzzle = null;
let puzzleCount = 0;
const MAX_PUZZLES = 3;

// Initialize the game
function initGame() {
  console.log("Initializing banana math game...");

  if (!puzzleDisplay || !solutionInput || !submitButton) {
    console.error("Essential DOM elements not found");
    return;
  }

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
    console.log("Fetching new puzzle...");
    puzzleDisplay.innerHTML = '<p>Loading puzzle...</p>';
    solutionInput.value = '';

    if (messageDisplay) {
      messageDisplay.textContent = '';
    }

    const timestamp = Date.now();
    const response = await fetch(`${API_URL}?cb=${timestamp}`);

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
    img.src = data.question; // Adjusted from data.url to data.question
    img.alt = "Puzzle Image";
    img.className = "puzzle-image";
    img.style.maxWidth = "100%";
    img.style.display = "block";

    img.onload = function() {
      console.log("Puzzle image loaded");
      puzzleDisplay.innerHTML = '';
      puzzleDisplay.appendChild(img);

      if (messageDisplay) {
        messageDisplay.textContent = `Puzzle ${puzzleCount + 1} of ${MAX_PUZZLES}`;
      }

      solutionInput.focus();
    };

    img.onerror = function() {
      console.error("Failed to load image:", data.question);
      puzzleDisplay.innerHTML = `
        <p>Failed to load puzzle.</p>
        <button onclick="fetchNewPuzzle()" class="submit-button">Try Again</button>
      `;
    };

  } catch (error) {
    console.error("Error fetching puzzle:", error);
    puzzleDisplay.innerHTML = `
      <p>Error loading puzzle: ${error.message}</p>
      <button onclick="fetchNewPuzzle()" class="submit-button">Try Again</button>
    `;
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
      <p>You've solved all the puzzles!</p>
    </div>
  `;

  if (messageDisplay) {
    messageDisplay.textContent = 'All puzzles completed!';
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

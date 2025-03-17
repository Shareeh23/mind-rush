const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let quoteCount = 0; // Counter to track number of quotes
let intervalId = null; // Store the interval ID to stop it later

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct) {
    if (quoteCount < 2) {
      renderNewQuote();
    } else {
      endGame();
    }
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  // Increment the quote count first
  quoteCount++;

  // Now check if we've already completed 3 quotes
  if (quoteCount > 3) {
    endGame();
    return; // No more quotes should be generated
  }

  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  quoteInputElement.value = null;

  if (intervalId) clearInterval(intervalId); // Clear previous interval if any
  startTimer();
  quoteCount++; // Increment the quote count
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  intervalId = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function endGame() {
  clearInterval(intervalId); // Stop the timer

  // Set 'win' result in localStorage
  localStorage.setItem('result', 'win');

  // Dispatch gameOver event to trigger UI updates
  const gameOverEvent = new CustomEvent('gameOver', {
    detail: { result: 'win' },
  });
  document.dispatchEvent(gameOverEvent);

  console.log('Game over! Result saved: win');

  // Disable input to prevent further typing
  quoteInputElement.disabled = true;

}

// Start with the first quote
renderNewQuote();

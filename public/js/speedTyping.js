const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let quoteCount = 0; // Counter to track number of quotes

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
    quoteCount++;
    if (quoteCount < 1) {
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
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';

  quote.split('').forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  quoteInputElement.value = null;
}

function endGame() {
  // Get the final time from localStorage
  const finalTime = parseInt(localStorage.getItem('stopwatchTime')) || 0;
  console.log(typeof finalTime);

  // Save result to localStorage
  localStorage.setItem('result', 'win');

  // Dispatch gameOver event
  const gameOverEvent = new CustomEvent('gameOver', {
    detail: {
      result: 'win',
      finalTime: +finalTime,
    },
  });
  document.dispatchEvent(gameOverEvent);

  console.log('Game over! Result saved: win, Time:', finalTime);

  // Disable input to prevent further typing
  quoteInputElement.disabled = true;

  // Send data to leaderboard
  sendTimeToLeaderboard(finalTime);
}

function sendTimeToLeaderboard(finalTime) {
  fetch('/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      time: finalTime,
    }),
    credentials: 'include', // Important to include cookies/session
    // Add this to follow redirects automatically
    redirect: 'follow'
  })
    .then((response) => {
      // Check if the response is a redirect
      if (response.redirected) {
        window.location.href = response.url;
        return { success: true, redirected: true };
      }
      
      // If it's not a redirect but has an error status
      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }
      
      // If it's a successful JSON response
      return response.json();
    })
    .then((data) => {
      console.log('Leaderboard entry sent successfully', data);
    })
    .catch((error) => {
      console.error('Error submitting leaderboard entry:', error);
      alert(
        'Failed to submit your score. Please try again or check if you are logged in.'
      );
    });
}


// Start with the first quote
renderNewQuote();

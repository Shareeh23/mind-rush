const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let quoteCount = 0; 

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
    if (quoteCount < 3) {
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
  const finalTime = parseInt(localStorage.getItem('stopwatchTime'));

  // Save result to localStorage
  localStorage.setItem('result', 'win');

  // Dispatch gameOver event
  const gameOverEvent = new CustomEvent('gameOver', {
    detail: {
      result: 'win',
      finalTime: finalTime,
    },
  });
  document.dispatchEvent(gameOverEvent);

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
    credentials: 'include', 
    redirect: 'follow'
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
        return { success: true, redirected: true };
      }
      
      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }
      
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

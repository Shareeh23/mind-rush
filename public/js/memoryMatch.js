const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let totalPairs = cards.length / 2;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
 
  this.classList.add('flip');
 
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
 
  // second click
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.item === secondCard.dataset.item;
 
  if (isMatch) {
    // Disable matched cards
    disableCards();
   
    // Increment matched pairs counter
    matchedPairs++;
   
    // Check if all pairs are matched
    if (matchedPairs === totalPairs) {
      // Use requestAnimationFrame to ensure UI updates before endGame runs
      requestAnimationFrame(() => {
        // Short timeout just to allow the last card flip to be seen
        setTimeout(() => {
          endGame('win');
        }, 300);
      });
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function endGame(result) {
  // Lock the board
  lockBoard = true;
  cards.forEach(card => {
    card.removeEventListener('click', flipCard);
  });
 
  // Store win result in localStorage
  localStorage.setItem('result', result);
 
  // Debug confirmation
  console.log('Game over! Result saved:', result);
 
  // Use forced reflow to ensure styles update immediately
  document.body.offsetHeight; // Force a reflow
 
  // Apply visual feedback for win with !important to override existing styles
  cards.forEach(card => {
    // Apply styles directly to the DOM element
    card.style.setProperty('background-color', 'rgba(0, 0, 255, 0.2)', 'important');
    card.style.setProperty('transform', 'scale(1.05)', 'important');
    card.style.setProperty('transition', 'transform 0.3s, background-color 0.5s', 'important');
  });
 
  // Create and dispatch a custom event to notify any parent systems
  const gameOverEvent = new CustomEvent('gameOver', { detail: { result } });
  document.dispatchEvent(gameOverEvent);
 
  return result;
}

// Initial shuffle
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

// Initialize game and reset counters
matchedPairs = 0;
cards.forEach(card => card.addEventListener('click', flipCard));

// Check if we need to restore a game state (e.g., if we're returning after a refresh)
document.addEventListener('DOMContentLoaded', () => {
  const savedResult = localStorage.getItem('result');
  if (savedResult === 'win') {
    // Apply win state visuals immediately if we have a saved win
    cards.forEach(card => {
      card.style.setProperty('background-color', 'rgba(0, 0, 255, 0.2)', 'important');
      card.style.setProperty('transform', 'scale(1.05)', 'important');
    });
  }
});
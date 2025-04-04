document.addEventListener('DOMContentLoaded', function () {
  const viewAllBtn = document.getElementById('view-all-btn');
  const viewAllLeaderboard = document.querySelector('.view-all-leaderboards');
  const leaderboardContainer = document.querySelector('.all-leaderboard');
  const illustration = document.querySelector('.achievers-svg');
  
  const newGameButton = document.getElementById('proceed-btn'); 
  const exitButton = document.getElementById('exit-btn');

  console.log(newGameButton);
  console.log(exitButton);

  if (newGameButton) {
    newGameButton.addEventListener('click', () => {
      if (typeof resetStopwatch === 'function') {
        resetStopwatch(); 
      }
    });
  }

  if (exitButton) {
    exitButton.addEventListener('click', () => {
      if (typeof resetStopwatch === 'function') {
        resetStopwatch();
      }
    });
  }

  viewAllBtn.addEventListener('click', function (event) {
    event.preventDefault();
    viewAllLeaderboard.classList.toggle('resize');
    leaderboardContainer.classList.toggle('show');
    illustration.classList.toggle('hide');

    if (leaderboardContainer.classList.contains('show')) {
      viewAllBtn.textContent = 'Hide';
    } else {
      viewAllBtn.textContent = 'View All';
    }
  });
});

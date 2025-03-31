document.addEventListener('DOMContentLoaded', function () {
  const viewAllBtn = document.getElementById('view-all-btn');
  const viewAllLeaderboard = document.querySelector('.view-all-leaderboards');
  const leaderboardContainer = document.querySelector('.all-leaderboard');
  const illustration = document.querySelector('.achievers-svg');

  viewAllBtn.addEventListener('click', function (event) {
    event.preventDefault();
    viewAllLeaderboard.classList.toggle('resize');
    leaderboardContainer.classList.toggle('show');
    illustration.classList.toggle('hide');

    // Change button text
    if (leaderboardContainer.classList.contains('show')) {
      viewAllBtn.textContent = 'Hide';
    } else {
      viewAllBtn.textContent = 'View All';
    }
  });
});

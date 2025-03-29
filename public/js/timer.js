const exitButton = document.getElementById('exit-btn');
const loginButton = document.getElementById('login-btn');
const logoutButton = document.getElementById('logout-btn');

const hoursElem = document.querySelector('.hours');
const minutesElem = document.querySelector('.minutes');
const secondsElem = document.querySelector('.seconds');

let stopwatchInterval;
let totalTimeInSeconds = parseInt(localStorage.getItem('stopwatchTime')) || 0;

// Format the time as hh:mm:ss
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return {
    hours: hours < 10 ? '0' + hours : hours,
    minutes: minutes < 10 ? '0' + minutes : minutes,
    seconds: secondsLeft < 10 ? '0' + secondsLeft : secondsLeft
  };
}

// Function to update the timer UI
function updateStopwatch() {
  const time = formatTime(totalTimeInSeconds);
  hoursElem.textContent = time.hours;
  minutesElem.textContent = time.minutes;
  secondsElem.textContent = time.seconds;
}

// Function to start the stopwatch
function startStopwatch() {
  updateStopwatch();
  setTimeout(() => {
    stopwatchInterval = setInterval(() => {
      totalTimeInSeconds++; 
      localStorage.setItem('stopwatchTime', totalTimeInSeconds);
      updateStopwatch();
    }, 1000);
  });
}

// Function to reset stopwatch
function resetStopwatch() {
  clearInterval(stopwatchInterval);
  localStorage.removeItem('stopwatchTime');
  totalTimeInSeconds = 0;
  updateStopwatch();
}

// Start timer on page load
window.addEventListener('DOMContentLoaded', () => {
  updateStopwatch();
  setTimeout(() => {
    startStopwatch();
  });
});

// Attach event listeners to reset the stopwatch
if (exitButton) {
  exitButton.addEventListener('click', () => {
    clearInterval(stopwatchInterval); 
    localStorage.removeItem('stopwatchTime');
    totalTimeInSeconds = 0;
    updateStopwatch(); // Update the UI to show 00:00:00
  });
};

/* // Select the "Exit" button
const exitButton = document.getElementById('clicker');
// Select necessary DOM elements
const hoursElem = document.querySelector('.hours');
const minutesElem = document.querySelector('.minutes');
const secondsElem = document.querySelector('.seconds');
let stopwatchInterval;
let totalTimeInSeconds = parseInt(localStorage.getItem('stopwatchTime')) || 0; // Retrieve saved time or default to 0

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
  // First update immediately
  updateStopwatch();
  // Start the interval after a 2-second delay
  setTimeout(() => {
    stopwatchInterval = setInterval(() => {
      totalTimeInSeconds++; // Increase time by 1 second
      // Save the updated time to localStorage
      localStorage.setItem('stopwatchTime', totalTimeInSeconds);
      // Update the stopwatch display
      updateStopwatch();
    }, 1000);
  }, 2000);
}

// Start the stopwatch after a 2-second delay when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Load previous saved time if available
  updateStopwatch(); // Ensure UI shows the correct time on page load
 
  setTimeout(() => {
    startStopwatch();
  });
});

// Stop and reset the stopwatch when clicking the exit button
if (exitButton) {
  exitButton.addEventListener('click', () => {
    clearInterval(stopwatchInterval); // Stop the stopwatch
    localStorage.removeItem('stopwatchTime'); // Clear the saved time
    totalTimeInSeconds = 0; // Reset the time counter
    updateStopwatch(); // Update the UI to show 00:00:00
  });
}
 */
  const themeSwitchBtn = document.querySelector('.theme-switch-btn');
  const themeIcon = themeSwitchBtn?.querySelector('i');
  const body = document.body;
 // Prevents errors if the button is missing

  // Function to apply dark mode based on localStorage
  function applyTheme() {
    console.log('hello')
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    return body.classList.toggle('dark-mode', darkModeEnabled);
  }

  // Apply theme on page load
  applyTheme();

  // Toggle theme when button is clicked
  themeSwitchBtn.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    const darkModeEnabled = body.classList.contains('dark-mode'); // Get state *after* toggling
    themeIcon.classList.toggle('fa-moon', !darkModeEnabled);
    themeIcon.classList.toggle('fa-sun', darkModeEnabled);
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
  });

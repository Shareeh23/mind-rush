const themeSwitchBtn = document.querySelector('.theme-switch-btn');
const themeIcon = themeSwitchBtn.querySelector('i');
const body = document.body;

// Initial setup - default to moon icon
themeIcon.classList.remove('fa-sun');
themeIcon.classList.add('fa-moon');

themeSwitchBtn.addEventListener('click', function() {
  // Toggle dark mode
  body.classList.toggle('dark-mode');
  
  // Toggle icon
  if (body.classList.contains('dark-mode')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
});
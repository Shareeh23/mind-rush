window.onload = () => {
  setTimeout(() => {
    document.querySelector('.circle').classList.add('show'); // Show circle first
  }, 2000);

  setTimeout(() => {
    document.querySelector('.menu-bar').classList.add('show'); // Show menu bar after circle
  }, 2000);
};

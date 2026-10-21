/* ════════════════════════════════════════════
   ÉCRAN D'OUVERTURE
   L'animation est entièrement en CSS (site.css) : ce script ne fait
   que mémoriser la visite, permettre de passer d'un clic et retirer l'écran.
════════════════════════════════════════════ */
(function () {
  var root = document.documentElement;
  var screen = document.getElementById('intro');
  if (!screen || !root.classList.contains('intro')) return;
  try { localStorage.setItem('ustad-intro', '1'); } catch (e) {}

  var done = false;
  function remove() { if (done) return; done = true; root.classList.remove('intro'); if (screen.parentNode) screen.parentNode.removeChild(screen); }
  function skip() { screen.style.transition = 'opacity .35s ease'; screen.style.opacity = '0'; setTimeout(remove, 350); }

  screen.addEventListener('click', skip);
  document.addEventListener('keydown', skip, { once: true });
  screen.addEventListener('animationend', function (e) { if (e.target === screen) remove(); });
  screen.addEventListener('webkitAnimationEnd', function (e) { if (e.target === screen) remove(); });
  setTimeout(remove, 3600); // au cas où l'événement de fin ne se déclenche pas
})();

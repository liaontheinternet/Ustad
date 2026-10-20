/* ════════════════════════════════════════════
   ÉCRAN D'OUVERTURE · animation « Espacement »
   Les lettres serrées et floues s'écartent jusqu'à leur place,
   la signature apparaît, puis l'écran s'efface.
   Une seule fois par navigateur ; un clic ou une touche le passe.
════════════════════════════════════════════ */
(function () {
  const root = document.documentElement;
  const screen = document.getElementById('intro');
  if (!screen || !root.classList.contains('intro')) return;

  const word = screen.querySelector('.intro-word');
  const tag = screen.querySelector('.intro-tag');
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  let done = false;

  try { localStorage.setItem('ustad-intro', '1'); } catch (e) {}

  function close() {
    if (done) return;
    done = true;
    const fade = screen.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: 'ease', fill: 'forwards' });
    fade.onfinish = () => { root.classList.remove('intro'); screen.remove(); };
  }

  function play() {
    if (done) return;
    word.animate([
      { opacity: 0, letterSpacing: '-.09em', marginRight: '.09em', filter: 'blur(.12em)' },
      { opacity: 1, offset: .55 },
      { opacity: 1, letterSpacing: '.12em', marginRight: '-.12em', filter: 'blur(0)' },
    ], { duration: 1500, delay: 150, fill: 'both', easing: EASE });
    tag.animate([
      { opacity: 0, letterSpacing: '.18em', marginRight: '-.18em' },
      { opacity: 1, letterSpacing: '.32em', marginRight: '-.32em' },
    ], { duration: 700, delay: 1150, fill: 'both', easing: EASE });
    setTimeout(close, 2500);
  }

  screen.addEventListener('click', close);
  document.addEventListener('keydown', close, { once: true });

  /* attendre la police du logo, sans jamais bloquer plus de 0,8 s */
  const fonts = document.fonts && document.fonts.load ? document.fonts.load("300 1em 'Lexend Zetta'") : Promise.resolve();
  Promise.race([fonts, new Promise(r => setTimeout(r, 800))]).then(play, play);
  setTimeout(close, 4500); // filet de sécurité
})();

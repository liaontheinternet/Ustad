/* ════════════════════════════════════════════
   SYSTÈME DE TABS
════════════════���═══════════════════════════ */

function setTab(t) {
  APP_STATE.tab = t;
  const isEnt = t === 'enterprise';

  // Highlight tab
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('on', btn.getAttribute('data-tab') === t);
  });

  // Show/hide forms
  const stdDiv = document.getElementById('std');
  const entDiv = document.getElementById('ent');
  if (stdDiv) stdDiv.style.display = isEnt ? 'none' : 'block';
  if (entDiv) entDiv.style.display = isEnt ? 'block' : 'none';

  if (!isEnt) {
    // Show/hide conditional fields
    const dtWrap   = document.getElementById('dt-wrap');
    const durWrap  = document.getElementById('dur-wrap');
    const destWrap = document.getElementById('dest-wrap');
    const destLbl  = document.getElementById('dest-lbl');

    if (dtWrap)   dtWrap.style.display   = (t === 'planned' || t === 'hourly') ? 'block' : 'none';
    if (durWrap)  durWrap.style.display  = (t === 'hourly') ? 'block' : 'none';
    if (destWrap) destWrap.style.display = 'block';

    // Label destination adaptatif selon l'onglet
    if (destLbl) {
      if (t === 'hourly') {
        destLbl.textContent = APP_STATE.lang === 'fr' ? 'Lieu d\'arrivée finale' : 'Final drop-off';
        destLbl.setAttribute('data-fr', 'Lieu d\'arrivée finale');
        destLbl.setAttribute('data-en', 'Final drop-off');
      } else {
        destLbl.textContent = APP_STATE.lang === 'fr' ? 'Destination' : 'Destination';
        destLbl.setAttribute('data-fr', 'Destination');
        destLbl.setAttribute('data-en', 'Destination');
      }
    }

    calcPrice();
  } else {
    // Enterprise: add first trip if empty
    if (APP_STATE.trips === 0) addTrip();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      setTab(btn.getAttribute('data-tab'));
    });
  });
  setTab(APP_STATE.tab);
});
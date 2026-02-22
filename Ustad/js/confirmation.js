/* ════════════════════════════════════════════
   ÉCRAN DE CONFIRMATION POST-RÉSERVATION
════════════════════════════════════════════ */

function genRef() {
  return 'UST-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function showConfirmation(formData) {
  const ref = genRef();
  const wrap = document.getElementById('conf-wrap');
  const std  = document.getElementById('std');
  const ent  = document.getElementById('ent');

  if (std) std.style.display = 'none';
  if (ent) ent.style.display = 'none';

  const tabsEl = document.querySelector('.tabs');
  if (tabsEl) tabsEl.style.display = 'none';

  if (!wrap) return;
  wrap.style.display = 'block';

  const refEl = document.getElementById('conf-ref');
  if (refEl) refEl.textContent = ref;

  // Recap fields
  const fields = {
    'conf-pickup':  formData.pickup  || '—',
    'conf-dest':    formData.dest    || '—',
    'conf-veh':     formData.veh     || '—',
    'conf-pax':     formData.pax     || '—',
    'conf-date':    formData.date    || (APP_STATE.lang === 'fr' ? 'Dès que possible' : 'As soon as possible'),
    'conf-price':   formData.price   || '—',
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // New booking button
  const btnNew = document.getElementById('conf-new');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      wrap.style.display = 'none';
      if (std) { std.style.display = 'block'; }
      if (tabsEl) tabsEl.style.display = '';
    });
  }
}
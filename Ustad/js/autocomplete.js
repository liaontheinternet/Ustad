/* ════════════════════════════════════════════
   AUTOCOMPLÉTION D'ADRESSES (Nominatim / OSM)
   Biaisé vers la Côte d'Azur
════════════════════════════════════════════ */

const AC_DELAY = 350; // ms debounce
const AC_MIN   = 3;   // caractères minimum

let acTimer = null;

function acSearch(inputEl, listEl) {
  const q = inputEl.value.trim();

  if (q.length < AC_MIN) {
    listEl.style.display = 'none';
    listEl.innerHTML = '';
    return;
  }

  clearTimeout(acTimer);
  acTimer = setTimeout(() => _acFetch(q, inputEl, listEl), AC_DELAY);
}

async function _acFetch(q, inputEl, listEl) {
  const lang = APP_STATE.lang === 'fr' ? 'fr' : 'en';
  const url = 'https://nominatim.openstreetmap.org/search'
    + '?q=' + encodeURIComponent(q)
    + '&format=jsonv2'
    + '&limit=6'
    + '&accept-language=' + lang
    + '&countrycodes=fr,mc,it'
    + '&addressdetails=1';

  try {
    const r = await fetch(url, { headers: { 'Accept-Language': lang } });
    const data = await r.json();

    listEl.innerHTML = '';

    if (!data || data.length === 0) {
      listEl.style.display = 'none';
      return;
    }

    data.forEach(place => {
      const parts = place.display_name.split(', ');
      const main  = parts[0] || place.display_name;
      const sub   = parts.slice(1, 3).join(', ');

      const item = document.createElement('div');
      item.className = 'ac-item';
      item.innerHTML = `
        <div class="ac-pin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="ac-text">
          <span class="ac-main">${main}</span>
          <span class="ac-sub">${sub}</span>
        </div>`;

      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = place.display_name;
        listEl.style.display = 'none';
        listEl.innerHTML = '';
        // Mettre en cache les coordonnées
        APP_STATE.coordCache[place.display_name.trim().toLowerCase()] = {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        };
        // Déclencher le calcul de prix
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      });

      listEl.appendChild(item);
    });

    listEl.style.display = 'block';
  } catch (e) {
    listEl.style.display = 'none';
  }
}

// Fermer la liste si clic ailleurs
document.addEventListener('click', (e) => {
  document.querySelectorAll('.ac-list').forEach(list => {
    if (!list.contains(e.target)) {
      list.style.display = 'none';
    }
  });
});

// Initialiser les champs autocomplete de la section standard
document.addEventListener('DOMContentLoaded', () => {
  ['pickup', 'dest'].forEach(id => {
    const input = document.getElementById(id);
    const list  = document.getElementById(id + '-ac');
    if (input && list) {
      input.addEventListener('input', () => acSearch(input, list));
      input.addEventListener('focus', () => {
        if (input.value.length >= AC_MIN) acSearch(input, list);
      });
    }
  });
});

/* ════════════════════════════════════════════
   AUTOCOMPLÉTION D'ADRESSES
   1. Google Places (clé CFG.maps_key)
   2. Secours automatique : Photon (OpenStreetMap, sans clé)
      si Google est bloqué, refusé ou indisponible
════════════════════════════════════════════ */

const AC_DELAY   = 250; // ms debounce
let   acTimer        = null;
let   _gmService     = null;
let   _gmGeocoder    = null;
let   _placesService = null;
let   _gmBroken      = false;

/* ── Google signale une clé refusée (domaine, quota, facturation) ── */
window.gm_authFailure = function () {
  _gmBroken = true;
  console.warn('Google Maps refusé : bascule sur Photon');
};

/* ── Chargement dynamique de l'API Google Maps ── */
(function () {
  const s   = document.createElement('script');
  s.async   = true;
  s.src     = 'https://maps.googleapis.com/maps/api/js'
            + '?key='       + CFG.maps_key
            + '&libraries=places'
            + '&loading=async'
            + '&callback=initMapsAC'
            + '&language='  + (document.documentElement.lang || 'fr');
  s.onerror = () => { _gmBroken = true; };
  document.head.appendChild(s);
})();

/* ── Callback appelé quand l'API est prête ── */
function initMapsAC() {
  try {
    _gmService  = new google.maps.places.AutocompleteService();
    _gmGeocoder = new google.maps.Geocoder();
    _placesService = new google.maps.places.PlacesService(document.createElement('div'));
  } catch (e) {
    _gmBroken = true;
  }
}

/* ── Branchement des champs (indépendant de Google) ── */
document.addEventListener('DOMContentLoaded', () => {
  ['pickup', 'dest'].forEach(id => {
    const input = document.getElementById(id);
    const list  = document.getElementById(id + '-ac');
    if (input && list) {
      input.addEventListener('input', e => { if (!e.isTrusted && e.detail === 'picked') return; acSearch(input, list); });
      input.addEventListener('focus', () => { if (input.value.length >= 3) acSearch(input, list); });
      input.addEventListener('keydown', e => acKeys(e, list));
    }
  });
});

/* ── Déclenchement avec debounce ── */
function acSearch(inputEl, listEl) {
  const q = inputEl.value.trim();
  if (q.length < 3) { acHide(listEl); return; }
  clearTimeout(acTimer);
  acTimer = setTimeout(() => _acFetch(q, inputEl, listEl), AC_DELAY);
}

function _acFetch(q, inputEl, listEl) {
  const lang = (typeof APP_STATE !== 'undefined' && APP_STATE.lang === 'en') ? 'en' : 'fr';
  if (_gmService && !_gmBroken) {
    _gmService.getPlacePredictions({
      input: q,
      componentRestrictions: { country: ['fr', 'mc', 'it'] },
      language: lang,
    }, (predictions, status) => {
      const OK = google.maps.places.PlacesServiceStatus.OK;
      if (status === OK && predictions && predictions.length) {
        acRender(inputEl, listEl, predictions.slice(0, 6).map(p => ({
          main: p.structured_formatting.main_text,
          sub:  p.structured_formatting.secondary_text || '',
          desc: p.description,
          placeId: p.place_id,
        })));
      } else {
        if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.warn('Google Places : ' + status + ', bascule sur Photon');
          _gmBroken = true;
        }
        _photon(q, lang, inputEl, listEl);
      }
    });
  } else {
    _photon(q, lang, inputEl, listEl);
  }
}

/* ── Secours : Photon (OpenStreetMap), centré sur la Côte d'Azur ── */
async function _photon(q, lang, inputEl, listEl) {
  try {
    const url = 'https://photon.komoot.io/api/?limit=6&lat=43.70&lon=7.26&lang=' + lang + '&q=' + encodeURIComponent(q);
    const r = await fetch(url);
    const d = await r.json();
    if (inputEl.value.trim() !== q) return; // saisie modifiée entre-temps
    const items = (d.features || []).map(f => {
      const p = f.properties || {};
      const street = [p.housenumber, p.street].filter(Boolean).join(' ');
      const main = p.name || street || p.city || '';
      const sub = [p.name && street ? street : '', p.postcode, p.city !== main ? p.city : '', p.country].filter(Boolean).join(', ');
      return { main, sub, desc: [main, sub].filter(Boolean).join(', '), coords: { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] } };
    }).filter(i => i.main);
    acRender(inputEl, listEl, items);
  } catch (e) {
    acHide(listEl);
  }
}

/* ── Affichage de la liste ── */
function _acEsc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function acRender(inputEl, listEl, items) {
  listEl.innerHTML = '';
  if (!items.length) { acHide(listEl); return; }
  items.forEach(it => {
    const item = document.createElement('div');
    item.className = 'ac-item';
    item.setAttribute('role', 'option');
    item.innerHTML = `
      <div class="ac-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
      <div class="ac-text"><span class="ac-main">${_acEsc(it.main)}</span><span class="ac-sub">${_acEsc(it.sub)}</span></div>`;
    item.addEventListener('mousedown', e => { e.preventDefault(); acPick(inputEl, listEl, it); });
    listEl.appendChild(item);
  });
  listEl.style.display = 'block';
}

function acPick(inputEl, listEl, it) {
  inputEl.value = it.desc;
  acHide(listEl);
  const key = it.desc.trim().toLowerCase();
  if (it.coords && typeof APP_STATE !== 'undefined') APP_STATE.coordCache[key] = it.coords;
  if (it.placeId && _placesService) {
    _placesService.getDetails({ placeId: it.placeId, fields: ['geometry'] }, (place, st) => {
      if (st === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location && typeof APP_STATE !== 'undefined') {
        APP_STATE.coordCache[key] = { lat: place.geometry.location.lat(), lon: place.geometry.location.lng() };
      }
    });
  }
  inputEl.dispatchEvent(new CustomEvent('input', { bubbles: true, detail: 'picked' }));
}

function acHide(listEl) { listEl.style.display = 'none'; listEl.innerHTML = ''; }

/* ── Clavier : flèches + Entrée ── */
function acKeys(e, listEl) {
  const items = [...listEl.querySelectorAll('.ac-item')];
  if (!items.length || listEl.style.display === 'none') return;
  let i = items.findIndex(x => x.classList.contains('sel'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
    items.forEach((x, k) => x.classList.toggle('sel', k === i));
  } else if (e.key === 'Enter' && i >= 0) {
    e.preventDefault();
    items[i].dispatchEvent(new MouseEvent('mousedown'));
  } else if (e.key === 'Escape') {
    acHide(listEl);
  }
}

/* ── Fermer la liste si clic ailleurs ── */
document.addEventListener('click', (e) => {
  document.querySelectorAll('.ac-list').forEach(list => {
    if (!list.contains(e.target) && !list.parentElement.contains(e.target)) list.style.display = 'none';
  });
});

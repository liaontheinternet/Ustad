/* ════════════════════════════════════════════
   AUTOCOMPLÉTION D'ADRESSES — Google Places
════════════════════════════════════════════ */

const AC_DELAY   = 250; // ms debounce
let   acTimer        = null;
let   _gmService     = null;
let   _gmGeocoder    = null;
let   _placesService = null;

/* ── Chargement dynamique de l'API Google Maps ── */
(function () {
  const s   = document.createElement('script');
  s.async   = true;
  s.src     = 'https://maps.googleapis.com/maps/api/js'
            + '?key='       + CFG.maps_key
            + '&libraries=places'
            + '&callback=initMapsAC'
            + '&language='  + (document.documentElement.lang || 'fr');
  document.head.appendChild(s);
})();

/* ── Callback appelé quand l'API est prête ── */
function initMapsAC() {
  _gmService  = new google.maps.places.AutocompleteService();
  _gmGeocoder = new google.maps.Geocoder();
  const _dummy = document.createElement('div');
  _placesService = new google.maps.places.PlacesService(_dummy);

  ['pickup', 'dest'].forEach(id => {
    const input = document.getElementById(id);
    const list  = document.getElementById(id + '-ac');
    if (input && list) {
      input.addEventListener('input', () => acSearch(input, list));
      input.addEventListener('focus', () => {
        if (input.value.length >= 3) acSearch(input, list);
      });
    }
  });
}

/* ── Déclenchement avec debounce ── */
function acSearch(inputEl, listEl) {
  const q = inputEl.value.trim();
  if (q.length < 3) {
    listEl.style.display = 'none';
    listEl.innerHTML = '';
    return;
  }
  clearTimeout(acTimer);
  acTimer = setTimeout(() => _acFetch(q, inputEl, listEl), AC_DELAY);
}

/* ── Appel Places AutocompleteService ── */
function _acFetch(q, inputEl, listEl) {
  if (!_gmService) return;

  _gmService.getPlacePredictions({
    input: q,
    componentRestrictions: { country: ['fr', 'mc', 'it'] },
    language: APP_STATE.lang === 'fr' ? 'fr' : 'en',
  }, (predictions, status) => {
    listEl.innerHTML = '';

    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      listEl.style.display = 'none';
      return;
    }

    predictions.slice(0, 6).forEach(pred => {
      const main = pred.structured_formatting.main_text;
      const sub  = pred.structured_formatting.secondary_text || '';

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
        const display = pred.description;
        inputEl.value = display;
        listEl.style.display = 'none';
        listEl.innerHTML = '';

        /* Mise en cache des coordonnées via Places API (pas besoin de Geocoding API) */
        _placesService.getDetails({ placeId: pred.place_id, fields: ['geometry'] }, (place, pStatus) => {
          if (pStatus === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const loc = place.geometry.location;
            APP_STATE.coordCache[display.trim().toLowerCase()] = {
              lat: loc.lat(),
              lon: loc.lng(),
            };
          }
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });

      listEl.appendChild(item);
    });

    listEl.style.display = 'block';
  });
}

/* ── Fermer la liste si clic ailleurs ── */
document.addEventListener('click', (e) => {
  document.querySelectorAll('.ac-list').forEach(list => {
    if (!list.contains(e.target)) list.style.display = 'none';
  });
});

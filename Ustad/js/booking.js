/* ════════════════════════════════════════════
   LOGIQUE DE BOOKING : PRIX, VALIDATION, TRAJETS MULTIPLES
════════════════════════════════════════════ */

// Counters
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cbtn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.getAttribute('data-count');
      const dir = parseInt(this.getAttribute('data-dir'));
      cnt(type, dir);
    });
  });

  // Partner code input
  document.getElementById('pcode').addEventListener('input', checkCode);

  // Inputs triggering price calc
  ['pickup', 'dest', 'bdt', 'dur', 'veh', 'pax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calcPrice);
      el.addEventListener('input', calcPrice);
    }
  });

  // Pax change → vérifier aussi le véhicule
  document.getElementById('pax')?.addEventListener('change', checkVeh);

  // Multi-trip button
  document.getElementById('btn-add-trip').addEventListener('click', addTrip);

  // Enterprise file upload
  document.getElementById('btn-attach-ent').addEventListener('click', function() {
    document.getElementById('ent-file').click();
  });

  document.getElementById('ent-file').addEventListener('change', function() {
    const nameEl = document.getElementById('ent-fname');
    if (this.files && this.files[0]) {
      nameEl.style.display = 'block';
      nameEl.textContent = '📎 ' + this.files[0].name;
    }
  });
});

function cnt(type, dir) {
  if (type === 'c') {
    APP_STATE.cabin = Math.max(0, APP_STATE.cabin + dir);
    document.getElementById('cn').textContent = APP_STATE.cabin;
  } else {
    APP_STATE.large = Math.max(0, APP_STATE.large + dir);
    document.getElementById('ln').textContent = APP_STATE.large;
  }
  checkVeh();
  calcPrice();
}

function checkVeh() {
  const p     = parseInt(document.getElementById('pax').value) || 1;
  const sel   = document.getElementById('veh');
  const al    = document.getElementById('valert');
  const fr    = APP_STATE.lang === 'fr';
  const cabin = APP_STATE.cabin;
  const large = APP_STATE.large;

  // ── Bascule automatique Van ──────────────────────────────
  if (p >= 5) {
    sel.value = 'van';
    al.style.display = 'block';
    al.className = 'valert';
    al.textContent = fr
      ? `⚠ ${p} passagers — Van sélectionné automatiquement (max 4 en berline).`
      : `⚠ ${p} passengers — Van selected automatically (max 4 in sedan).`;
    return;
  }
  if (large > 2) {
    sel.value = 'van';
    al.style.display = 'block';
    al.className = 'valert';
    al.textContent = fr
      ? `⚠ ${large} grandes valises — Van sélectionné automatiquement (max 2 en berline).`
      : `⚠ ${large} large bags — Van selected automatically (max 2 in sedan).`;
    return;
  }

  // ── Recommandations (sans bascule) ──────────────────────
  if (p >= 4) {
    al.style.display = 'block';
    al.className = 'valert';
    al.textContent = fr
      ? `⚠ ${p} passagers — Le Van est recommandé au-delà de 3 passagers pour votre confort.`
      : `⚠ ${p} passengers — Van recommended above 3 passengers for comfort.`;
    return;
  }
  if (large >= 2 && cabin >= 1) {
    al.style.display = 'block';
    al.className = 'valert';
    al.textContent = fr
      ? '⚠ 2 grandes valises + bagages cabine — Le Van est recommandé pour ce volume.'
      : '⚠ 2 large bags + cabin bags — Van recommended for this volume.';
    return;
  }
  if (cabin > 4) {
    al.style.display = 'block';
    al.className = 'valert';
    al.textContent = fr
      ? `⚠ ${cabin} bagages cabine — Le Van est recommandé (max 4 en berline).`
      : `⚠ ${cabin} cabin bags — Van recommended (max 4 in sedan).`;
    return;
  }

  al.style.display = 'none';
}

function checkCode() {
  const code = document.getElementById('pcode').value.toUpperCase().trim();
  const msg = document.getElementById('pmsg');
  const hw = document.getElementById('hotel-wrap');

  if (!code) {
    msg.style.display = 'none';
    hw.style.display = 'none';
    APP_STATE.partner = false;
    calcPrice();
    return;
  }

  if (code === 'USTADHOTELS') {
    APP_STATE.partner = true;
    msg.style.display = 'block';
    msg.className = 'pmsg ok';
    msg.textContent = APP_STATE.lang === 'fr'
      ? '✓ Code partenaire validé — tarifs hôtel appliqués.'
      : '✓ Partner code validated — hotel rates applied.';
    hw.style.display = 'block';
  } else {
    APP_STATE.partner = false;
    msg.style.display = 'block';
    msg.className = 'pmsg err';
    msg.textContent = APP_STATE.lang === 'fr'
      ? '✗ Code non reconnu.'
      : '✗ Code not recognized.';
    hw.style.display = 'none';
  }

  calcPrice();
}

async function geocode(address) {
  const k = address.trim().toLowerCase();
  if (APP_STATE.coordCache[k]) return APP_STATE.coordCache[k];

  /* Google Geocoder (disponible après chargement de l'API Maps) */
  if (window.google?.maps?.Geocoder) {
    const googleResult = await new Promise((resolve) => {
      new google.maps.Geocoder().geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lon: loc.lng() });
        } else {
          resolve(null);
        }
      });
    });
    if (googleResult) {
      APP_STATE.coordCache[k] = googleResult;
      return googleResult;
    }
  }

  /* Fallback Nominatim (Maps API absente ou échec geocodage) */
  try {
    const url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(address) + '&format=jsonv2&limit=1&accept-language=' + (APP_STATE.lang === 'fr' ? 'fr' : 'en');
    const r = await fetch(url);
    const data = await r.json();
    if (data && data[0]) {
      const c = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      APP_STATE.coordCache[k] = c;
      return c;
    }
  } catch (e) {}
  return null;
}

function haversineKm(A, B) {
  const R = 6371;
  const dLat = (B.lat - A.lat) * Math.PI / 180;
  const dLon = (B.lon - A.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(A.lat * Math.PI/180) * Math.cos(B.lat * Math.PI/180) * Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.35);
}

async function getRouteKm(a, b) {
  const [A, B] = await Promise.all([geocode(a), geocode(b)]);
  if (!A || !B) return null;

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch(
      'https://router.project-osrm.org/route/v1/driving/' + A.lon + ',' + A.lat + ';' + B.lon + ',' + B.lat + '?overview=false',
      { signal: ctrl.signal }
    );
    clearTimeout(timeout);
    const d = await r.json();
    if (d.code === 'Ok' && d.routes[0]) {
      return Math.round(d.routes[0].distance / 1000);
    }
  } catch (e) {}

  // Fallback : distance à vol d'oiseau × 1.35 (approximation routière)
  return haversineKm(A, B);
}

function calcPrice() {
  clearTimeout(APP_STATE.priceTimer);
  APP_STATE.priceTimer = setTimeout(_calcPrice, 700);
}

async function _calcPrice() {
  const veh = document.getElementById('veh').value;
  const ok = document.getElementById('pok');
  const pv = document.getElementById('pv');
  const pno = document.getElementById('pno');
  const hint = document.getElementById('phint');

  let night = false;
  const dt = document.getElementById('bdt').value;
  if (dt) {
    const timePart = dt.includes('T') ? dt.split('T')[1] : '';
    const h = timePart ? parseInt(timePart.split(':')[0]) : new Date(dt).getHours();
    if (h < 7 || h >= 20) night = true;
  } else if (APP_STATE.tab === 'now') {
    const h = new Date().getHours();
    if (h < 7 || h >= 20) night = true;
  }

  const puRaw = (document.getElementById('pickup').value || '').trim();
  const atPort = ['aeroport', 'aéroport', 'airport', 'port', 'gare', 'station'].some(k => puRaw.toLowerCase().includes(k));

  function show(p, detail, est = true) {
    if (night) p = Math.round(p * 1.2);
    ok.style.display = 'flex';
    hint.style.display = 'none';
    pv.textContent = p + ' €';

    const lbl = est ? (APP_STATE.lang === 'fr' ? 'Estimation · ' : 'Estimate · ') : '';
    pno.textContent = lbl + detail + (night ? (APP_STATE.lang === 'fr' ? ' · +20% nuit' : ' · +20% night') : '');
  }

  // Hourly
  if (APP_STATE.tab === 'hourly') {
    const h = parseInt(document.getElementById('dur').value);
    const r = TARIFS_HEURE[veh] || 90;
    show(h * r, h + 'h · ' + r + '€/h', false);
    return;
  }

  // Partner hotel
  if (APP_STATE.partner) {
    const de = (document.getElementById('dest').value || '').toLowerCase();
    for (const [k, pr] of Object.entries(TARIFS_HOTEL)) {
      if (de.includes(k)) {
        const key = veh === 'berline' ? 'b' : veh === 'van' ? 'v' : 's';
        show((pr[key] || pr.b) + (atPort ? 10 : 0), APP_STATE.lang === 'fr' ? 'Tarif fixe partenaire' : 'Fixed partner rate', false);
        return;
      }
    }
  }

  const pu = puRaw;
  const de = (document.getElementById('dest').value || '').trim();

  if (!pu || !de) {
    ok.style.display = 'none';
    hint.style.display = 'block';
    return;
  }

  ok.style.display = 'flex';
  hint.style.display = 'none';
  pv.textContent = '…';
  pno.textContent = APP_STATE.lang === 'fr' ? 'Calcul de la distance réelle…' : 'Calculating real distance…';

  const km = await getRouteKm(pu, de);
  if (km !== null) {
    const r = TARIFS_KM[veh] || 3;
    const base = Math.max(Math.round(km * r), 20) + (atPort ? 10 : 0);
    show(base, km + ' km · ' + r + '€/km');
  } else {
    ok.style.display = 'flex';
    hint.style.display = 'none';
    pv.textContent = APP_STATE.lang === 'fr' ? 'Sur devis' : 'On quote';
    pno.textContent = APP_STATE.lang === 'fr' ? 'Confirmation par l\'équipe Ustad' : 'Confirmed by Ustad team';
  }
}

function addTrip() {
  APP_STATE.trips++;
  const n = APP_STATE.trips;
  const fr = APP_STATE.lang === 'fr';
  const wrap = document.getElementById('trips');

  const card = document.createElement('div');
  card.className = 'trip';
  card.id = 't' + n;
  card.innerHTML = `
    <div class="trip-head">
      <span class="trip-lbl">${fr ? 'Trajet' : 'Journey'} ${n}</span>
      <button class="trip-del" type="button" data-trip="${n}">✕ ${fr ? 'Supprimer' : 'Remove'}</button>
    </div>
    <div class="trip-body">
      <div class="row row--3">
        <div class="f"><span class="lbl">${fr ? 'Date de départ' : 'Date'}</span><input type="date"/></div>
        <div class="f"><span class="lbl">${fr ? 'Heure souhaitée' : 'Time'}</span><input type="time"/></div>
        <div class="f f--w"><span class="lbl">${fr ? 'Lieu de départ' : 'Pickup'}</span><div class="ac-wrap"><input type="text" autocomplete="off" placeholder="${fr ? 'Adresse, aéroport…' : 'Address, airport…'}" data-ac="dep"/><div class="ac-list" style="display:none"></div></div></div>
      </div>
      <div class="row row--3">
        <div class="f"><span class="lbl">${fr ? 'Passagers' : 'Passengers'}</span>
          <select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select>
        </div>
        <div class="f"><span class="lbl">${fr ? 'Véhicule' : 'Vehicle'}</span>
          <select>
            <option>Berline</option>
            <option>Van</option>
            <option>Berline Confort</option>
          </select>
        </div>
        <div class="f f--w"><span class="lbl">${fr ? 'Noms & contacts passagers' : 'Passenger names & contacts'}</span><input type="text" placeholder="${fr ? 'Prénom Nom, +33…' : 'First Last, +33…'}"/></div>
      </div>
      <div class="row row--2">
        <div class="f"><span class="lbl">${fr ? 'Heure d\'arrivée souhaitée' : 'Desired arrival'}</span><input type="time"/></div>
        <div class="f f--w"><span class="lbl">${fr ? 'Lieu d\'arrivée' : 'Destination'}</span><div class="ac-wrap"><input type="text" autocomplete="off" placeholder="${fr ? 'Adresse d\'arrivée' : 'Drop-off address'}" data-ac="arr"/><div class="ac-list" style="display:none"></div></div></div>
      </div>
    </div>
  `;

  wrap.appendChild(card);

  // Delete button
  card.querySelector('.trip-del').addEventListener('click', function() {
    const tripId = this.getAttribute('data-trip');
    delTrip(tripId);
  });

  // Autocomplete
  card.querySelectorAll('[data-ac]').forEach(input => {
    input.addEventListener('input', function() {
      const listEl = this.closest('.ac-wrap').querySelector('.ac-list');
      acSearch(this, listEl);
    });
  });
}

function delTrip(n) {
  const el = document.getElementById('t' + n);
  if (el) el.remove();
}
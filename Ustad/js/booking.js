/* ════════════════════════════════════════════
   CALCUL PRIX, VÉHICULE, MULTI-TRAJETS
════════════════════════════════════════════ */

function cnt(type, dir) {
  if (type === 'c') {
    cabin = Math.max(0, cabin + parseInt(dir));
    document.getElementById('cn').textContent = cabin;
  } else {
    large = Math.max(0, large + parseInt(dir));
    document.getElementById('ln').textContent = large;
  }
  checkVeh();
  calcPrice();
}

function checkVeh() {
  const p = parseInt(document.getElementById('pax')?.value || 1);
  const sel = document.getElementById('veh');
  const al = document.getElementById('valert');

  let need = false, msg = '';

  if (p >= 4) {
    need = true;
    msg = lang === 'fr'
      ? `⚠ ${p} passagers — Van Classe V recommandé (max 7).`
      : `⚠ ${p} passengers — Van Class V recommended (max 7).`;
  } else if (large >= 3) {
    need = true;
    msg = lang === 'fr'
      ? `⚠ ${large} grandes valises — Van Classe V recommandé.`
      : `⚠ ${large} large bags — Van Class V recommended.`;
  } else if (large >= 2 && cabin >= 2) {
    need = true;
    msg = lang === 'fr'
      ? '⚠ Volume important — Van Classe V recommandé.'
      : '⚠ High volume — Van Class V recommended.';
  }

  if (need && sel && sel.value !== 'van') {
    if (al) {
      al.style.display = 'block';
      al.textContent = msg;
    }
    sel.value = 'van';
  } else if (!need && al) {
    al.style.display = 'none';
  }
}

function checkCode() {
  const code = (document.getElementById('pcode')?.value || '').toUpperCase().trim();
  const msg = document.getElementById('pmsg');
  const hw = document.getElementById('hotel-wrap');

  if (!code) {
    if (msg) msg.style.display = 'none';
    if (hw) hw.style.display = 'none';
    partner = false;
    calcPrice();
    return;
  }

  if (code === 'USTADHOTELS') {
    partner = true;
    if (msg) {
      msg.style.display = 'block';
      msg.className = 'pmsg ok';
      msg.textContent = lang === 'fr'
        ? '✓ Code partenaire validé — tarifs hôtel appliqués.'
        : '✓ Partner code validated — hotel rates applied.';
    }
    if (hw) hw.style.display = 'block';
  } else {
    partner = false;
    if (msg) {
      msg.style.display = 'block';
      msg.className = 'pmsg err';
      msg.textContent = lang === 'fr' ? '✗ Code non reconnu.' : '✗ Code not recognized.';
    }
    if (hw) hw.style.display = 'none';
  }

  calcPrice();
}

let priceTimer = null;

function calcPrice() {
  clearTimeout(priceTimer);
  priceTimer = setTimeout(_calcPrice, 700);
}

async function _calcPrice() {
  const veh = document.getElementById('veh')?.value || 'berline';
  const ok = document.getElementById('pok');
  const pv = document.getElementById('pv');
  const pno = document.getElementById('pno');
  const hint = document.getElementById('phint');

  let night = false;
  const dt = document.getElementById('bdt')?.value;
  if (dt) {
    const h = new Date(dt).getHours();
    if (h < 7 || h >= 20) night = true;
  }

  const puRaw = (document.getElementById('pickup')?.value || '').trim();
  const atPort = ['aeroport','aéroport','airport','port','gare','station'].some(k => puRaw.toLowerCase().includes(k));

  function show(p, detail, est = true) {
    if (night) p = Math.round(p * 1.2);
    if (ok) ok.style.display = 'flex';
    if (hint) hint.style.display = 'none';
    if (pv) pv.textContent = p + ' €';
    const lbl = est ? (lang === 'fr' ? 'Estimation · ' : 'Estimate · ') : '';
    if (pno) pno.textContent = lbl + detail + (night ? (lang === 'fr' ? ' · +20% nuit' : ' · +20% night') : '');
  }

  // Hourly rate
  if (tab === 'hourly') {
    const h = parseInt(document.getElementById('dur')?.value || 1);
    const r = HH[veh] || 90;
    show(h * r, h + 'h · ' + r + '€/h', false);
    return;
  }

  // Partner hotel rate
  if (partner) {
    const de = (document.getElementById('dest')?.value || '').toLowerCase();
    for (const [k, pr] of Object.entries(HOTEL)) {
      if (de.includes(k)) {
        const key = veh === 'berline' ? 'b' : veh === 'van' ? 'v' : 's';
        show((pr[key] || pr.b) + (atPort ? 10 : 0), lang === 'fr' ? 'Tarif fixe partenaire' : 'Fixed partner rate', false);
        return;
      }
    }
  }

  // Distance-based
  const pu = puRaw;
  const de = (document.getElementById('dest')?.value || '').trim();

  if (!pu || !de) {
    if (ok) ok.style.display = 'none';
    if (hint) hint.style.display = 'block';
    return;
  }

  if (ok) ok.style.display = 'flex';
  if (hint) hint.style.display = 'none';
  if (pv) pv.textContent = '…';
  if (pno) pno.textContent = lang === 'fr' ? 'Calcul de la distance réelle…' : 'Calculating real distance…';

  const km = await getRouteKm(pu, de);
  if (km !== null) {
    const r = KM[veh] || 3;
    const base = Math.max(Math.round(km * r), 20) + (atPort ? 10 : 0);
    show(base, km + ' km · ' + r + '€/km');
  } else {
    const r = KM[veh] || 3;
    show(20 * r + (atPort ? 10 : 0), lang === 'fr' ? '~estimation (réseau indisponible)' : '~estimate (offline)');
  }
}

async function geocode(address) {
  const k = address.trim().toLowerCase();
  if (coordCache[k]) return coordCache[k];

  try {
    const url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(address) + '&format=jsonv2&limit=1&accept-language=' + (lang === 'fr' ? 'fr' : 'en');
    const r = await fetch(url);
    const data = await r.json();
    if (data && data[0]) {
      const c = {lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon)};
      coordCache[k] = c;
      return c;
    }
  } catch(e) {}
  return null;
}

async function getRouteKm(a, b) {
  const [A, B] = await Promise.all([geocode(a), geocode(b)]);
  if (!A || !B) return null;

  try {
    const url = 'https://router.project-osrm.org/route/v1/driving/' + A.lon + ',' + A.lat + ';' + B.lon + ',' + B.lat + '?overview=false';
    const r = await fetch(url);
    const d = await r.json();
    if (d.code === 'Ok' && d.routes && d.routes[0]) {
      return Math.round(d.routes[0].distance / 1000);
    }
  } catch(e) {}
  return null;
}

// Multi-trajets
function addTrip() {
  trips++;
  const n = trips;
  const fr = lang === 'fr';
  const wrap = document.getElementById('trips');
  if (!wrap) return;

  const card = document.createElement('div');
  card.className = 'trip';
  card.id = 't' + n;
  card.innerHTML = `
    <div class="trip-head">
      <span class="trip-lbl">${fr ? 'Trajet' : 'Journey'} ${n}</span>
      <button class="trip-del" data-trip="${n}" type="button">✕ ${fr ? 'Supprimer' : 'Remove'}</button>
    </div>
    <div class="trip-body">
      <div class="row row--3">
        <div class="f"><span class="lbl">${fr ? 'Date de départ' : 'Date'}</span><input type="date"/></div>
        <div class="f"><span class="lbl">${fr ? 'Heure souhaitée' : 'Time'}</span><input type="time"/></div>
        <div class="f f--w"><span class="lbl">${fr ? 'Lieu de départ' : 'Pickup'}</span><div class="ac-wrap"><input type="text" autocomplete="off" placeholder="${fr ? 'Adresse, aéroport…' : 'Address, airport…'}"/><div id="tac-dep-${n}" class="ac-list" style="display:none"></div></div></div>
      </div>
      <div class="row row--3">
        <div class="f"><span class="lbl">${fr ? 'Passagers' : 'Passengers'}</span><select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select></div>
        <div class="f"><span class="lbl">${fr ? 'Véhicule' : 'Vehicle'}</span><select><option>${fr ? 'Berline — Cl. E' : 'Sedan — Cl. E'}</option><option>${fr ? 'Van — Cl. V' : 'Van — Cl. V'}</option><option>${fr ? 'Berline — Cl. S' : 'Sedan — Cl. S'}</option></select></div>
        <div class="f f--w"><span class="lbl">${fr ? 'Noms & contacts' : 'Names & contacts'}</span><input type="text" placeholder="${fr ? 'Prénom Nom, +33…' : 'First Last, +33…'}"/></div>
      </div>
      <div class="row row--2">
        <div class="f"><span class="lbl">${fr ? "Heure d'arrivée" : 'Desired arrival'}</span><input type="time"/></div>
        <div class="f f--w"><span class="lbl">${fr ? "Lieu d'arrivée" : 'Destination'}</span><div class="ac-wrap"><input type="text" autocomplete="off" placeholder="${fr ? "Adresse d'arrivée" : 'Drop-off address'}"/><div id="tac-arr-${n}" class="ac-list" style="display:none"></div></div></div>
      </div>
    </div>
  `;

  wrap.appendChild(card);

  // Event listener pour la suppression
  card.querySelector('.trip-del')?.addEventListener('click', () => {
    delTrip(n);
  });
}

function delTrip(n) {
  const el = document.getElementById('t' + n);
  if (el) el.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  // Counter buttons
  document.querySelectorAll('.cbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-count');
      const dir = btn.getAttribute('data-dir');
      cnt(type, dir);
    });
  });

  // Code partenaire
  document.getElementById('pcode')?.addEventListener('input', checkCode);

  // Véhicule & passagers
  document.getElementById('veh')?.addEventListener('change', () => {
    checkVeh();
    calcPrice();
  });

  document.getElementById('pax')?.addEventListener('change', () => {
    checkVeh();
    calcPrice();
  });

  // Date/durée change
  document.getElementById('bdt')?.addEventListener('change', calcPrice);
  document.getElementById('dur')?.addEventListener('change', calcPrice);

  // Autocomplete
  document.getElementById('pickup')?.addEventListener('input', (e) => {
    acSearch(e.target,`_*

/* ════════════════════════════════════════════
   USTAD · Parcours de réservation (version 2)
   Réutilise : config.js (CFG, tarifs, APP_STATE),
   autocomplete.js (Google Places), form.js (genEmailHtml)
════════════════════════════════════════════ */

(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const t = (fr, en) => (APP_STATE.lang === 'en' ? en : fr);

  const BOOK = { km: null, A: null, B: null, prices: {}, veh: 'berline', night: false, forfait: null };
  const VEH_LABEL = { berline: { fr: 'Berline', en: 'Sedan' }, van: { fr: 'Van', en: 'Van' }, classe_s: { fr: 'Classe S', en: 'S-Class' } };
  const VEH_MAX = { berline: 3, van: 6, classe_s: 3 };

  /* ── Langue ── */
  function setLang(l) {
    APP_STATE.lang = l;
    document.documentElement.lang = l;
    $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
    $$('[data-fr]').forEach(el => { const v = el.getAttribute('data-' + l); if (v != null) el.innerHTML = v; });
    $$('[data-fr-placeholder]').forEach(el => { el.placeholder = el.getAttribute('data-' + l + '-placeholder') || el.placeholder; });
    try { localStorage.setItem('ustad-lang', l); } catch (e) {}
    if ($('#step2').classList.contains('on')) renderPrices();
    if ($('#step3').classList.contains('on')) renderRecap();
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ── Étapes ── */
  function go(n) {
    $$('.step').forEach(s => s.classList.toggle('on', s.id === 'step' + n));
    if (window.innerWidth < 900) $('#book').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  function bad(id, on) { const f = document.getElementById(id)?.closest('.field'); if (f) f.classList.toggle('bad', on); }

  /* ── Géocodage + distance routière ── */
  async function geocode(address) {
    const k = address.trim().toLowerCase();
    if (APP_STATE.coordCache[k]) return APP_STATE.coordCache[k];
    const svc = typeof _placesService !== 'undefined' ? _placesService : null;
    if (svc) {
      const r = await new Promise(res => {
        svc.findPlaceFromQuery({ query: address, fields: ['geometry'] }, (results, status) => {
          const loc = status === google.maps.places.PlacesServiceStatus.OK && results?.[0]?.geometry?.location;
          res(loc ? { lat: loc.lat(), lon: loc.lng() } : null);
        });
      });
      if (r) return (APP_STATE.coordCache[k] = r);
    }
    try {
      const r = await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=' + encodeURIComponent(address));
      const d = await r.json();
      if (d && d[0]) return (APP_STATE.coordCache[k] = { lat: +d[0].lat, lon: +d[0].lon });
    } catch (e) {}
    return null;
  }

  function crowKm(A, B) {
    const R = 6371, rad = x => x * Math.PI / 180;
    const a = Math.sin(rad(B.lat - A.lat) / 2) ** 2 + Math.cos(rad(A.lat)) * Math.cos(rad(B.lat)) * Math.sin(rad(B.lon - A.lon) / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.35);
  }

  function distKm(A, B) {
    const R = 6371, rad = x => x * Math.PI / 180;
    const a = Math.sin(rad(B.lat - A.lat) / 2) ** 2 + Math.cos(rad(A.lat)) * Math.cos(rad(B.lat)) * Math.sin(rad(B.lon - A.lon) / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function routeKm(A, B) {
    if (!A || !B) return null;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${A.lon},${A.lat};${B.lon},${B.lat}?overview=false`, { signal: ctrl.signal });
      clearTimeout(timer);
      const d = await r.json();
      if (d.code === 'Ok' && d.routes[0]) return Math.round(d.routes[0].distance / 1000);
    } catch (e) {}
    return crowKm(A, B);
  }

  /* ── Prix : grille Ustad (config.js → PRESTIGE) ── */
  const VEHS = ['berline', 'van', 'classe_s'];
  const inPts = (P, pts) => !!P && pts.some(([lat, lon, r]) => distKm(P, { lat, lon }) <= r);
  const near = (P, c) => !!P && distKm(P, c) <= c.r;
  const up5 = x => Math.ceil(x / 5) * 5;

  // Classe un lieu : 'aeroport', 'gare', une zone de la grille, 'nice' ou null
  function classify(P, txt) {
    if (near(P, PRESTIGE.aeroport) || /a[ée]roport|airport/i.test(txt)) return 'aeroport';
    if (near(P, PRESTIGE.gare) || (/\bgare\b/i.test(txt) && /nice/i.test(txt))) return 'gare';
    const z = PRESTIGE.forfaits.find(f => f.pts && inPts(P, f.pts));
    if (z) return z;
    if (inPts(P, PRESTIGE.nice)) return 'nice';
    return null;
  }
  const special = k => PRESTIGE.forfaits.find(f => f.special === k);

  function findForfait(a, b) {
    const niceSide = x => x === 'nice' || x === 'gare' || x === 'aeroport';
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair('aeroport', 'nice') || pair('aeroport', 'gare')) return special('aeroport');
    if (pair('gare', 'nice')) return special('gare');
    if (niceSide(a) && b && typeof b === 'object') return b;
    if (niceSide(b) && a && typeof a === 'object') return a;
    return null;
  }

  function price(veh) {
    let p = null;
    if (BOOK.forfait) p = BOOK.forfait[veh];
    else if (BOOK.km != null) {
      const f = PRESTIGE.formule[veh];
      p = Math.max(up5(f.base + BOOK.km * f.km), f.min);
    }
    if (p == null) return null;
    const sup = PRESTIGE.supplements;
    if (BOOK.pickupSup) p += sup.priseEnCharge;
    if (BOOK.night) p += sup.nuit;
    return p;
  }
  const fmt = p => (p == null ? t('Sur devis', 'On quote') : p + ' €');

  function renderPrices() {
    VEHS.forEach(v => { const el = $(`[data-price="${v}"]`); if (el) el.textContent = fmt(BOOK.prices[v]); });
    $$('.veh').forEach(b => b.classList.toggle('on', b.dataset.veh === BOOK.veh));
    $('#route').innerHTML = `<b>${esc($('#pickup').value)}</b> → <b>${esc($('#dest').value)}</b><br>${dateLabel()}${BOOK.km != null ? ' · ' + BOOK.km + ' km' : ''}`;
    const sup = PRESTIGE.supplements, notes = [];
    if (BOOK.forfait) notes.push(t(`Prix fixe Nice ↔ ${BOOK.forfait.zone}.`, `Fixed price Nice ↔ ${BOOK.forfait.zone}.`));
    else if (BOOK.km == null) notes.push(t("Distance introuvable : l'équipe Ustad vous confirme le prix.", 'Distance not found: the Ustad team will confirm the price.'));
    if (BOOK.pickupSup) notes.push(t(`Prise en charge aéroport, port ou gare : +${sup.priseEnCharge} € inclus.`, `Airport, port or station pick-up: +€${sup.priseEnCharge} included.`));
    if (BOOK.night) notes.push(t(`Tarif de nuit (avant ${sup.nuitAvant} h et après ${sup.nuitApres} h) : +${sup.nuit} € inclus.`, `Night rate (before ${sup.nuitAvant}:00 and after ${sup.nuitApres}:00): +€${sup.nuit} included.`));
    if (BOOK.km != null || BOOK.forfait) notes.push(t('Prix tout compris, confirmé par Ustad.', 'All-inclusive price, confirmed by Ustad.'));
    $('#price-note').textContent = notes.join(' ');
  }

  function dateLabel() {
    const d = when();
    if (!d) return '';
    return d.toLocaleString(APP_STATE.lang === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  }
  function when() {
    const ds = $('#date').value, ts = $('#time').value;
    return ds && ts ? new Date(ds + 'T' + ts) : null;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ── Étape 1 : trajet ── */
  const today = new Date();
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $('#date').min = iso(today);
  $('#date').value = iso(today);

  $('#step1').addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('#err1');
    const pu = $('#pickup').value.trim(), de = $('#dest').value.trim(), d = when();
    bad('pickup', !pu); bad('dest', !de); bad('date', !$('#date').value); bad('time', !$('#time').value);
    if (!pu || !de || !d) { err.textContent = t('Renseignez le départ, l’arrivée, la date et l’heure.', 'Enter pick-up, drop-off, date and time.'); return; }
    if (d.getTime() < Date.now() - 5 * 60000) { bad('time', true); err.textContent = t('Choisissez une heure à venir.', 'Choose a future time.'); return; }
    err.textContent = '';

    const btn = e.submitter || $('#step1 .btn');
    btn.disabled = true; btn.textContent = t('Calcul du trajet…', 'Calculating route…');
    [BOOK.A, BOOK.B] = await Promise.all([geocode(pu), geocode(de)]);
    BOOK.km = await routeKm(BOOK.A, BOOK.B);
    btn.disabled = false; btn.textContent = t('Voir les prix', 'See prices');

    const h = d.getHours(), sup = PRESTIGE.supplements;
    BOOK.night = h < sup.nuitAvant || h >= sup.nuitApres;
    const ca = classify(BOOK.A, pu), cb = classify(BOOK.B, de);
    BOOK.forfait = findForfait(ca, cb);
    BOOK.pickupSup = ca === 'aeroport' || ca === 'gare' || near(BOOK.A, PRESTIGE.port) || /port (de nice|lympia)|port lympia/i.test(pu);
    BOOK.prices = { berline: price('berline'), van: price('van'), classe_s: price('classe_s') };
    renderPrices();
    go(2);
  });
  ['pickup', 'dest', 'date', 'time'].forEach(id => $('#' + id).addEventListener('input', () => bad(id, false)));

  /* ── Étape 2 : véhicule ── */
  $$('.veh').forEach(b => b.addEventListener('click', () => { BOOK.veh = b.dataset.veh; renderPrices(); }));
  $('#to3').addEventListener('click', () => { renderRecap(); go(3); });

  function renderRecap() {
    $('#recap').innerHTML = `<b>${t(VEH_LABEL[BOOK.veh].fr, VEH_LABEL[BOOK.veh].en)} · ${fmt(BOOK.prices[BOOK.veh])}</b><br>${esc($('#pickup').value)} → ${esc($('#dest').value)}<br>${dateLabel()}`;
  }

  /* ── Étape 3 : coordonnées + envoi ── */
  $('#step3').addEventListener('submit', e => {
    e.preventDefault();
    const v = id => $('#' + id).value.trim();
    const err = $('#err3');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'));
    const checks = { fname: !!v('fname'), lname: !!v('lname'), phone: v('phone').replace(/\D/g, '').length >= 8, email: emailOk };
    Object.entries(checks).forEach(([id, ok]) => bad(id, !ok));
    const rgpd = $('#rgpd').checked;
    $('.check').classList.toggle('bad', !rgpd);
    const pax = +$('#pax').value;
    const paxOk = pax <= VEH_MAX[BOOK.veh];
    bad('pax', !paxOk);

    if (Object.values(checks).includes(false)) { err.textContent = t('Vérifiez les champs en rouge.', 'Check the fields in red.'); return; }
    if (!paxOk) {
      err.textContent = pax > VEH_MAX.van
        ? t('Au-delà de 6 passagers, il faut deux véhicules : écrivez-nous sur WhatsApp au +33 6 61 50 54 54.', 'For more than 6 passengers, two vehicles are needed: message us on WhatsApp at +33 6 61 50 54 54.')
        : t('Au-delà de 3 passagers, choisissez le Van.', 'For more than 3 passengers, choose the Van.');
      return;
    }
    if (!rgpd) { err.textContent = t('Merci d’accepter l’utilisation de vos données pour la réservation.', 'Please accept the use of your data for the booking.'); return; }
    err.textContent = '';
    send();
  });
  ['fname', 'lname', 'phone', 'email', 'pax'].forEach(id => $('#' + id).addEventListener('input', () => { bad(id, false); $('#err3').textContent = ''; }));
  $('#rgpd').addEventListener('change', () => { $('.check').classList.remove('bad'); $('#err3').textContent = ''; });

  function send() {
    const v = id => $('#' + id).value.trim();
    const ref = 'UST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const now = new Date().toLocaleString('fr-FR');
    const vehLabel = VEH_LABEL[BOOK.veh].fr;
    const prix = fmt(BOOK.prices[BOOK.veh]);
    const d = when();
    const dateFr = d.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const notes = [v('flight') && 'Vol : ' + v('flight'), v('notes')].filter(Boolean).join('\n');
    const data = {
      ref, now, fname: v('fname'), lname: v('lname'), email: v('email'), phone: v('phone'),
      type: 'Trajet planifié', dateLabel: dateFr, pickup: v('pickup'), dest: v('dest'),
      vehLabel, pax: v('pax'), cabin: 0, large: 0, baby: false, partner: false,
      notes: esc(notes).replace(/\n/g, '<br>'), prix,
    };

    const btn = $('#submit');
    btn.disabled = true; btn.textContent = t('Envoi…', 'Sending…');

    const html = typeof genEmailHtml === 'function' ? genEmailHtml(data) : JSON.stringify(data);
    const mail = window.emailjs
      ? emailjs.send(CFG.emailjs_service_id, CFG.emailjs_template_std, {
          from_name: data.fname + ' ' + data.lname, from_email: data.email, reply_to: data.email,
          to_name: 'Équipe Ustad', message: html,
        }).then(() => true, e => { console.error('EmailJS', e); return false; })
      : Promise.resolve(false);

    fetch('/.netlify/functions/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, notes, bdt: d.toISOString(), tab: 'planned' }),
    }).catch(() => {});

    mail.then(ok => {
      btn.disabled = false; btn.textContent = t('Confirmer la réservation', 'Confirm booking');
      $('#conf-title').textContent = t(`Merci ${data.fname}`, `Thank you ${data.fname}`);
      $('#conf-ref').textContent = t('Référence ', 'Reference ') + ref;
      $('#conf-msg').textContent = ok
        ? t(`Votre demande (${vehLabel}, ${prix}) est bien reçue. Nous vous confirmons le trajet par téléphone ou e-mail très vite.`, `Your request (${VEH_LABEL[BOOK.veh].en}, ${prix}) has been received. We will confirm your ride by phone or e-mail shortly.`)
        : t('L’envoi automatique n’a pas abouti. Envoyez-nous votre demande sur WhatsApp, elle est déjà rédigée.', 'Automatic sending failed. Send us your request on WhatsApp, it is already written.');
      const wa = `Bonjour Ustad, réservation ${ref} : ${data.pickup} → ${data.dest}, ${dateFr}, ${vehLabel}, ${data.pax} passager(s), ${prix}. ${data.fname} ${data.lname}, ${data.phone}${notes ? '. Demandes : ' + notes.replace(/\n/g, ' / ') : ''}`;
      $('#conf-wa').href = 'https://wa.me/' + CFG.whatsapp_numero + '?text=' + encodeURIComponent(wa);
      go(4);
    });
  }

  /* ── Modales ── */
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-modal]');
    if (opener) { e.preventDefault(); document.getElementById(opener.dataset.modal)?.showModal(); return; }
    if (e.target.matches('dialog.modal')) e.target.close();
    if (e.target.matches('[data-close]')) e.target.closest('dialog').close();
  });

  /* ── Init ── */
  $('#year').textContent = new Date().getFullYear();
  if (window.emailjs) emailjs.init({ publicKey: CFG.emailjs_public_key });
  let saved = null;
  try { saved = localStorage.getItem('ustad-lang'); } catch (e) {}
  if (saved === 'en' || (!saved && (navigator.language || '').slice(0, 2) !== 'fr')) setLang('en');
})();

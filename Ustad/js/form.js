/* ════════════════════════════════════════════
   SOUMISSION DES FORMULAIRES — BON DE COMMANDE
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-sub-std')?.addEventListener('click', submitStd);
  document.getElementById('btn-sub-ent')?.addEventListener('click', submitEnt);
});

/* ─── Validation ─── */
function markErr(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  el.closest('.f')?.classList.toggle('f--err', state);
}

/* ─── Génération de la référence ─── */
function makeRef() {
  return 'UST-' + Math.random().toString(36).substring(2,8).toUpperCase();
}

/* ─── Tab label ─── */
function tabLabel() {
  const map = { now:'Trajet minute', planned:'Trajet planifié', hourly:'Mise à disposition', enterprise:'Entreprise' };
  return map[APP_STATE.tab] || APP_STATE.tab;
}

/* ─── Génération du bon de commande HTML (table-based pour Gmail dark mode) ─── */
function genEmailHtml({ ref, now, fname, lname, email, phone, type, dateLabel, pickup, dest, vehLabel, pax, cabin, large, baby, partner, notes, prix }) {
  const BLACK = '#1A1A1A';
  const WHITE = '#FFFFFF';
  const SEP   = 'border-bottom:1px solid rgba(0,0,0,.10)';

  // Ligne directe dans la table parente — labels alignés grâce à la largeur fixe de la 1re colonne
  const trow = (lbl, val, last = false) => (val && val !== '—') ? `
      <tr>
        <td width="150" valign="top" style="width:150px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(0,0,0,.45);padding:9px 12px 9px 16px;vertical-align:top;${last ? '' : SEP};">${lbl}</td>
        <td valign="top" style="font-size:13px;color:${BLACK};font-weight:600;line-height:1.4;padding:9px 16px 9px 0;word-break:break-word;vertical-align:top;${last ? '' : SEP};">${val}</td>
      </tr>` : '';

  // Bloc avec en-tête noir — les trow s'insèrent directement dans cette table
  const tblock = (title, rows) => !rows.trim() ? '' : `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BLACK};margin-bottom:14px;">
      <tr><td colspan="2" class="black-bg" bgcolor="${BLACK}" style="background-color:${BLACK};padding:9px 16px;">
        <span style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${WHITE};font-weight:normal;">${title}</span>
      </td></tr>
      ${rows}
    </table>`;

  const clientRows =
    trow('Nom', `${fname} ${lname}`) +
    trow('E-mail', email) +
    trow('Téléphone', phone, true);

  const prestationRows =
    trow('Type', type) +
    trow('Date &amp; heure', dateLabel) +
    trow('Prise en charge', pickup) +
    trow('Destination', dest) +
    trow('Véhicule', vehLabel) +
    trow('Passagers', String(pax), true);

  const baggageRows =
    trow('Bagages cabine', String(cabin)) +
    trow('Grandes valises', String(large)) +
    trow('Siège bébé', baby ? 'Oui' : 'Non') +
    trow('Code partenaire', partner ? 'USTADHOTELS' : '—', true);

  const notesBlock = notes ? tblock('Demandes spéciales',
    `<tr><td style="font-size:13px;color:${BLACK};font-weight:600;line-height:1.5;padding:10px 16px;">${notes}</td></tr>`) : '';

  return `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>Bon de commande Ustad — ${ref}</title>
  <style>
    :root { color-scheme: light only; }
    body  { color-scheme: light only; }
    [data-ogsc] .black-bg { background-color: ${BLACK} !important; }
    [data-ogsc] .white-bg { background-color: ${WHITE} !important; }
    [data-ogsc] .outer-bg { background-color: #EBEBEB  !important; }
    [data-ogsc] .black-txt { color: ${BLACK} !important; }
    [data-ogsc] .white-txt { color: ${WHITE} !important; }
  </style>
</head>
<body bgcolor="#EBEBEB" style="margin:0;padding:0;background-color:#EBEBEB;color-scheme:light;">
<table class="outer-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EBEBEB" style="background-color:#EBEBEB;">
<tr><td align="center" style="padding:24px 16px;">

  <!-- BANNIÈRE -->
  <table class="black-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${BLACK}" style="max-width:620px;background-color:${BLACK};">
    <tr><td style="padding:32px 40px 28px;border-bottom:3px solid ${WHITE};">
      <p class="white-txt" style="font-family:Georgia,serif;font-size:24px;letter-spacing:.32em;text-transform:uppercase;color:${WHITE};margin:0;font-weight:normal;">Ustad</p>
      <p style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.42);margin:4px 0 0;">Savoir-Faire in Motion</p>
      <p style="font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.65);margin:22px 0 0;">Référence</p>
      <p class="white-txt" style="font-size:14px;letter-spacing:.12em;color:${WHITE};font-weight:bold;margin:3px 0 0;">${ref}</p>
      <p style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.06em;margin:6px 0 0;">${now}</p>
    </td></tr>
  </table>

  <!-- CORPS -->
  <table class="white-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${WHITE}" style="max-width:620px;background-color:${WHITE};">
    <tr><td style="padding:32px 40px 24px;">
      <p style="font-size:13px;color:rgba(0,0,0,.60);line-height:1.7;margin:0 0 24px;padding-bottom:22px;border-bottom:1px solid rgba(0,0,0,.10);">
        Bonjour ${fname},<br>
        Votre demande de réservation a bien été transmise à l'équipe Ustad.<br>
        Un conseiller vous contactera très prochainement pour confirmer votre trajet.
      </p>

      ${tblock('Client', clientRows)}
      ${tblock('Prestation', prestationRows)}
      ${tblock('Bagages &amp; Options', baggageRows)}
      ${notesBlock}

      <!-- TARIF -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BLACK};margin-bottom:14px;">
        <tr><td style="padding:20px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p class="black-txt" style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${BLACK};margin:0;">Tarif estimé</p>
              <p style="font-size:10px;color:rgba(0,0,0,.40);margin:5px 0 0;line-height:1.5;">Tarif indicatif<br>Confirmation par l'équipe Ustad</p>
            </td>
            <td align="right" class="black-txt" style="font-size:32px;color:${BLACK};font-weight:700;letter-spacing:-.01em;white-space:nowrap;vertical-align:middle;">${prix}</td>
          </tr></table>
        </td></tr>
      </table>

    </td></tr>
  </table>

  <!-- PIED DE PAGE -->
  <table class="black-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${BLACK}" style="max-width:620px;background-color:${BLACK};">
    <tr><td style="padding:22px 40px;border-top:3px solid ${WHITE};text-align:center;">
      <p style="font-family:Georgia,serif;font-size:14px;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,255,255,.58);margin:0;">Ustad</p>
      <p style="font-size:11px;color:rgba(255,255,255,.38);margin:7px 0 0;letter-spacing:.06em;">ustadcontact@gmail.com &nbsp;·&nbsp; +33 6 61 50 54 54</p>
      <p style="font-size:9px;color:rgba(255,255,255,.55);margin:16px 0 0;line-height:1.6;letter-spacing:.03em;border-top:1px solid rgba(255,255,255,.12);padding-top:14px;">💡 Pour sauvegarder ce document en PDF : Imprimer cet e-mail (Ctrl+P) → Enregistrer en PDF</p>
      <p style="font-size:9px;color:rgba(255,255,255,.22);margin:10px 0 0;line-height:1.6;letter-spacing:.04em;">Ce bon de commande est généré automatiquement lors de votre réservation en ligne.<br>© ${new Date().getFullYear()} Ustad — Savoir-Faire in Motion</p>
    </td></tr>
  </table>

</td></tr>
</table>
</body></html>`;
}

/* ─── Prix courant affiché ─── */
function currentPrice() {
  const pv = document.getElementById('pv');
  return pv && pv.textContent !== '…' ? pv.textContent : 'Sur devis';
}

/* ═══ FORMULAIRE STANDARD (à la demande / planifié / à l'heure) ═══ */
function submitStd() {
  const fr = APP_STATE.lang === 'fr';

  // Champs requis
  const fname  = document.getElementById('std-fname')?.value.trim()  || '';
  const lname  = document.getElementById('std-lname')?.value.trim()  || '';
  const email  = document.getElementById('std-email')?.value.trim()  || '';
  const phone  = document.getElementById('std-phone')?.value.trim()  || '';
  const pickup = document.getElementById('pickup')?.value.trim()     || '';
  const dest   = document.getElementById('dest')?.value.trim()       || '';
  const veh    = document.getElementById('veh')?.value               || '';
  const pax    = document.getElementById('pax')?.value               || '';
  const notes  = document.getElementById('std-notes')?.value.trim()  || '';
  const baby   = document.getElementById('std-baby')?.checked        || false;
  const rgpd   = document.getElementById('rgpd-std-chk')?.checked    || false;
  const bdt    = document.getElementById('bdt')?.value               || '';
  const dur    = document.getElementById('dur')?.value               || '';

  // Validation
  let ok = true;
  if (!fname)   { markErr('std-fname',  true); ok = false; } else markErr('std-fname',  false);
  if (!lname)   { markErr('std-lname',  true); ok = false; } else markErr('std-lname',  false);
  if (!email)   { markErr('std-email',  true); ok = false; } else markErr('std-email',  false);
  if (!pickup)  { markErr('pickup',     true); ok = false; } else markErr('pickup',     false);
  if (!dest) {
    markErr('dest', true); ok = false;
  } else {
    markErr('dest', false);
  }
  if (!rgpd) {
    document.getElementById('rgpd-std')?.classList.add('rgpd-err');
    ok = false;
  } else {
    document.getElementById('rgpd-std')?.classList.remove('rgpd-err');
  }
  if (!ok) {
    alert(fr ? 'Veuillez remplir tous les champs obligatoires et accepter la politique de confidentialité.' : 'Please fill all required fields and accept the privacy policy.');
    return;
  }

  // Formatage de la date
  let dateLabel = fr ? 'Dès que possible' : 'As soon as possible';
  if (APP_STATE.tab === 'planned' && bdt) {
    const d = new Date(bdt);
    dateLabel = d.toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  } else if (APP_STATE.tab === 'hourly' && dur) {
    dateLabel = dur + (fr ? ' heure(s)' : ' hour(s)');
  }

  const vehLabel = { berline:'Berline', van:'Van', classe_s:'Berline Confort' }[veh] || veh;
  const prix = currentPrice();
  const ref  = makeRef();
  const now  = new Date().toLocaleString(fr ? 'fr-FR' : 'en-GB');

  // Bon de commande HTML stylisé
  const bdc = genEmailHtml({
    ref, now,
    fname, lname, email, phone,
    type:      tabLabel(),
    dateLabel,
    pickup,
    dest,
    vehLabel,
    pax,
    cabin:     APP_STATE.cabin,
    large:     APP_STATE.large,
    baby,
    partner:   APP_STATE.partner,
    notes,
    prix,
  });

  _sendEmail(CFG.emailjs_template_std, {
    from_name:  `${fname} ${lname}`,
    from_email: email,
    reply_to:   email,
    to_name:    'Équipe Ustad',
    message:    bdc,
  }, (emailSent) => {
    showConfirmation({
      ref, now,
      fname, lname, email, phone,
      type:  tabLabel(),
      date:  dateLabel,
      pickup,
      dest,
      veh:   vehLabel,
      pax,
      notes,
      price: prix,
      emailSent,
      emailHtml: bdc,
    });

    // Créer l'événement Google Calendar (fire-and-forget)
    fetch('/.netlify/functions/book', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ref, fname, lname, email, phone,
        type:     tabLabel(),
        pickup,   dest,
        vehLabel, pax, notes, prix,
        bdt,      dur,
        tab:      APP_STATE.tab,
      }),
    }).catch(() => {}); // silencieux — la réservation est déjà confirmée

    // Reset
    APP_STATE.cabin = 0; APP_STATE.large = 0; APP_STATE.partner = false;
  });
}

/* ─── Bon de commande HTML — Entreprise ─── */
function genEmailHtmlEnt({ ref, now, company, contact, email, phone, trajets, fileName }) {
  const BLACK = '#1A1A1A';
  const WHITE = '#FFFFFF';
  const SEP   = 'border-bottom:1px solid rgba(0,0,0,.10)';

  const trow = (lbl, val, last = false) => (val && val !== '—') ? `
      <tr>
        <td width="150" valign="top" style="width:150px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(0,0,0,.45);padding:9px 12px 9px 16px;vertical-align:top;${last ? '' : SEP};">${lbl}</td>
        <td valign="top" style="font-size:13px;color:${BLACK};font-weight:600;line-height:1.4;padding:9px 16px 9px 0;word-break:break-word;vertical-align:top;${last ? '' : SEP};">${val}</td>
      </tr>` : '';

  const tblock = (title, rows) => !rows.trim() ? '' : `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BLACK};margin-bottom:14px;">
      <tr><td colspan="2" class="black-bg" bgcolor="${BLACK}" style="background-color:${BLACK};padding:9px 16px;">
        <span style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${WHITE};font-weight:normal;">${title}</span>
      </td></tr>
      ${rows}
    </table>`;

  const clientRows =
    trow('Société',    company) +
    trow('Responsable', contact) +
    trow('E-mail',     email) +
    trow('Téléphone',  phone, true);

  const tripBlocks = trajets.map((t, i) => tblock(`Trajet ${i + 1}`,
    trow('Date', t.date) +
    trow('Heure départ', t.time) +
    trow('Lieu de départ', t.dep) +
    trow('Heure d\'arrivée', t.timeArr) +
    trow('Destination', t.arr) +
    trow('Passagers', t.pax) +
    trow('Véhicule', t.vType) +
    trow('Noms passagers', t.pnames, true)
  )).join('');

  const docBlock = fileName ? tblock('Document joint',
    `<tr><td colspan="2" style="padding:10px 16px;font-size:13px;color:${BLACK};font-weight:600;">📎 ${fileName}</td></tr>`) : '';

  return `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>Bon de commande Entreprise Ustad — ${ref}</title>
  <style>
    :root { color-scheme: light only; }
    body  { color-scheme: light only; }
    [data-ogsc] .black-bg { background-color: ${BLACK} !important; }
    [data-ogsc] .white-bg { background-color: ${WHITE} !important; }
    [data-ogsc] .outer-bg { background-color: #EBEBEB  !important; }
    [data-ogsc] .black-txt { color: ${BLACK} !important; }
    [data-ogsc] .white-txt { color: ${WHITE} !important; }
  </style>
</head>
<body bgcolor="#EBEBEB" style="margin:0;padding:0;background-color:#EBEBEB;color-scheme:light;">
<table class="outer-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EBEBEB" style="background-color:#EBEBEB;">
<tr><td align="center" style="padding:24px 16px;">

  <table class="black-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${BLACK}" style="max-width:620px;background-color:${BLACK};">
    <tr><td style="padding:32px 40px 28px;border-bottom:3px solid ${WHITE};">
      <p class="white-txt" style="font-family:Georgia,serif;font-size:24px;letter-spacing:.32em;text-transform:uppercase;color:${WHITE};margin:0;font-weight:normal;">Ustad</p>
      <p style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.42);margin:4px 0 0;">Savoir-Faire in Motion</p>
      <p style="font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.65);margin:22px 0 0;">Demande Entreprise · Référence</p>
      <p class="white-txt" style="font-size:14px;letter-spacing:.12em;color:${WHITE};font-weight:bold;margin:3px 0 0;">${ref}</p>
      <p style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.06em;margin:6px 0 0;">${now}</p>
    </td></tr>
  </table>

  <table class="white-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${WHITE}" style="max-width:620px;background-color:${WHITE};">
    <tr><td style="padding:32px 40px 24px;">
      <p style="font-size:13px;color:rgba(0,0,0,.60);line-height:1.7;margin:0 0 24px;padding-bottom:22px;border-bottom:1px solid rgba(0,0,0,.10);">
        Bonjour ${contact},<br>
        Votre demande entreprise a bien été transmise à l'équipe Ustad.<br>
        Un conseiller vous contactera très prochainement pour établir votre devis.
      </p>

      ${tblock('Entreprise', clientRows)}
      ${tripBlocks}
      ${docBlock}

    </td></tr>
  </table>

  <table class="black-bg" width="620" cellpadding="0" cellspacing="0" bgcolor="${BLACK}" style="max-width:620px;background-color:${BLACK};">
    <tr><td style="padding:22px 40px;border-top:3px solid ${WHITE};text-align:center;">
      <p style="font-family:Georgia,serif;font-size:14px;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,255,255,.58);margin:0;">Ustad</p>
      <p style="font-size:11px;color:rgba(255,255,255,.38);margin:7px 0 0;letter-spacing:.06em;">ustadcontact@gmail.com &nbsp;·&nbsp; +33 6 61 50 54 54</p>
      <p style="font-size:9px;color:rgba(255,255,255,.22);margin:14px 0 0;line-height:1.6;letter-spacing:.04em;border-top:1px solid rgba(255,255,255,.12);padding-top:14px;">Demande générée automatiquement · © ${new Date().getFullYear()} Ustad — Savoir-Faire in Motion</p>
    </td></tr>
  </table>

</td></tr>
</table>
</body></html>`;
}

/* ═══ FORMULAIRE ENTREPRISE ═══ */
function submitEnt() {
  const fr = APP_STATE.lang === 'fr';

  const company = document.getElementById('ent-company')?.value.trim() || '';
  const contact = document.getElementById('ent-contact')?.value.trim() || '';
  const email   = document.getElementById('ent-email')?.value.trim()   || '';
  const phone   = document.getElementById('ent-phone')?.value.trim()   || '';
  const rgpd    = document.getElementById('rgpd-ent-chk')?.checked     || false;

  let ok = true;
  if (!company) { markErr('ent-company', true); ok = false; } else markErr('ent-company', false);
  if (!contact) { markErr('ent-contact', true); ok = false; } else markErr('ent-contact', false);
  if (!email)   { markErr('ent-email',   true); ok = false; } else markErr('ent-email',   false);
  if (!rgpd) {
    document.getElementById('rgpd-ent')?.classList.add('rgpd-err');
    ok = false;
  } else {
    document.getElementById('rgpd-ent')?.classList.remove('rgpd-err');
  }
  if (!ok) {
    alert(fr ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill all required fields.');
    return;
  }

  // Récupérer les trajets sous forme d'objets
  const trajets = [];
  document.querySelectorAll('.trip').forEach((card) => {
    const times = card.querySelectorAll('input[type=time]');
    trajets.push({
      dep:     card.querySelector('[data-ac="dep"]')?.value       || '—',
      arr:     card.querySelector('[data-ac="arr"]')?.value       || '—',
      date:    card.querySelector('input[type=date]')?.value      || '—',
      time:    times[0]?.value                                    || '—',
      timeArr: times[1]?.value                                    || '',
      pax:     card.querySelectorAll('select')[0]?.value          || '—',
      vType:   card.querySelectorAll('select')[1]?.value          || '—',
      pnames:  card.querySelector('input[type=text]:not([data-ac])')?.value || '—',
    });
  });

  const ref      = makeRef();
  const now      = new Date().toLocaleString(fr ? 'fr-FR' : 'en-GB');
  const fileEl   = document.getElementById('ent-file');
  const file     = fileEl?.files?.[0] || null;
  const fileName = file ? file.name : null;

  const btn = document.getElementById('btn-sub-ent');
  if (btn) { btn.disabled = true; btn.textContent = fr ? 'Envoi en cours…' : 'Sending…'; }

  // Lire le fichier en base64 si présent, puis envoyer
  const sendWithFile = (fileBase64) => {
    const htmlBody = genEmailHtmlEnt({ ref, now, company, contact, email, phone, trajets, fileName });

    fetch('/.netlify/functions/enterprise-send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ref, company, contact, email, phone,
        trajets, fileName, htmlBody, fileBase64,
      }),
    })
    .then(r => r.json())
    .then(data => {
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Envoyer la demande' : 'Send request'; }
      showConfirmation({
        ref, now,
        fname: contact, lname: '', email, phone,
        type:  fr ? 'Entreprise' : 'Enterprise',
        date:  now,
        pickup: fr ? 'Voir les trajets dans l\'e-mail' : 'See journeys in e-mail',
        dest:  '—', veh: '—', pax: '—', notes: '',
        price: fr ? 'Sur devis' : 'Quote',
        emailSent: !!data.ok,
        emailHtml: htmlBody,
      });
      APP_STATE.trips = 0;
    })
    .catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Envoyer la demande' : 'Send request'; }
      alert(fr ? 'Erreur lors de l\'envoi. Veuillez réessayer.' : 'Send error. Please try again.');
    });
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Extraire uniquement la partie base64 (sans "data:...;base64,")
      const base64 = e.target.result.split(',')[1];
      sendWithFile(base64);
    };
    reader.readAsDataURL(file);
  } else {
    sendWithFile(null);
  }
}

/* ─── Envoi EmailJS ─── */
function _sendEmail(templateId, params, onSuccess) {
  const fr = APP_STATE.lang === 'fr';
  const btn = document.getElementById('btn-sub-std') || document.getElementById('btn-sub-ent');
  if (btn) { btn.disabled = true; btn.textContent = fr ? 'Envoi en cours…' : 'Sending…'; }

  emailjs.send(CFG.emailjs_service_id, templateId, params)
    .then(() => {
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Confirmer la réservation' : 'Confirm booking'; }
      onSuccess(true);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Confirmer la réservation' : 'Confirm booking'; }
      onSuccess(false);
    });
}
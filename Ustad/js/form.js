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
  const NAVY  = '#0D1B2A';
  const RED   = '#8B1A1A';
  const CREAM = '#F5F0E8';
  const SEP   = 'border-bottom:1px solid rgba(13,27,42,.07);';

  // Ligne de données : cellule label + cellule valeur
  const trow = (lbl, val, last = false) => (val && val !== '—') ? `
      <tr><td style="padding:0;${last ? '' : SEP}">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="38%" style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(13,27,42,.45);padding:9px 12px 9px 16px;vertical-align:top;">${lbl}</td>
          <td style="font-size:13px;color:${NAVY};font-weight:600;line-height:1.4;padding:9px 16px 9px 0;word-break:normal;overflow-wrap:break-word;">${val}</td>
        </tr></table>
      </td></tr>` : '';

  // Bloc avec en-tête bordeaux
  const tblock = (title, rows) => !rows.trim() ? '' : `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${RED};margin-bottom:14px;">
      <tr><td bgcolor="${RED}" style="background-color:${RED};padding:9px 16px;">
        <span style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${CREAM};font-weight:normal;">${title}</span>
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
    `<tr><td style="font-size:13px;color:${NAVY};font-weight:600;line-height:1.5;padding:10px 16px;">${notes}</td></tr>`) : '';

  return `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Bon de commande Ustad — ${ref}</title>
</head>
<body bgcolor="#c5bdb4" style="margin:0;padding:0;background-color:#c5bdb4;">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#c5bdb4" style="background-color:#c5bdb4;">
<tr><td align="center" style="padding:24px 16px;">

  <!-- BANNIÈRE -->
  <table width="620" cellpadding="0" cellspacing="0" bgcolor="${NAVY}" style="max-width:620px;background-color:${NAVY};">
    <tr><td style="padding:32px 40px 28px;border-bottom:3px solid ${RED};">
      <p style="font-family:Georgia,serif;font-size:24px;letter-spacing:.32em;text-transform:uppercase;color:${CREAM};margin:0;font-weight:normal;">Ustad</p>
      <p style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(232,224,212,.42);margin:4px 0 0;">Savoir-Faire in Motion</p>
      <p style="font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,212,.65);margin:22px 0 0;">Référence</p>
      <p style="font-size:14px;letter-spacing:.12em;color:${CREAM};font-weight:bold;margin:3px 0 0;">${ref}</p>
      <p style="font-size:10px;color:rgba(232,224,212,.45);letter-spacing:.06em;margin:6px 0 0;">${now}</p>
    </td></tr>
  </table>

  <!-- CORPS -->
  <table width="620" cellpadding="0" cellspacing="0" bgcolor="${CREAM}" style="max-width:620px;background-color:${CREAM};">
    <tr><td style="padding:32px 40px 24px;">
      <p style="font-size:13px;color:rgba(13,27,42,.62);line-height:1.7;margin:0 0 24px;padding-bottom:22px;border-bottom:1px solid rgba(13,27,42,.10);">
        Bonjour ${fname},<br>
        Votre demande de réservation a bien été transmise à l'équipe Ustad.<br>
        Un conseiller vous contactera très prochainement pour confirmer votre trajet.
      </p>

      ${tblock('Client', clientRows)}
      ${tblock('Prestation', prestationRows)}
      ${tblock('Bagages &amp; Options', baggageRows)}
      ${notesBlock}

      <!-- TARIF -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${RED};margin-bottom:14px;">
        <tr><td style="padding:20px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${RED};margin:0;">Tarif estimé</p>
              <p style="font-size:10px;color:rgba(13,27,42,.40);margin:5px 0 0;line-height:1.5;">Tarif indicatif<br>Confirmation par l'équipe Ustad</p>
            </td>
            <td align="right" style="font-size:32px;color:${NAVY};font-weight:700;letter-spacing:-.01em;white-space:nowrap;vertical-align:middle;">${prix}</td>
          </tr></table>
        </td></tr>
      </table>

    </td></tr>
  </table>

  <!-- PIED DE PAGE -->
  <table width="620" cellpadding="0" cellspacing="0" bgcolor="${NAVY}" style="max-width:620px;background-color:${NAVY};">
    <tr><td style="padding:22px 40px;border-top:3px solid ${RED};text-align:center;">
      <p style="font-family:Georgia,serif;font-size:14px;letter-spacing:.32em;text-transform:uppercase;color:rgba(232,224,212,.58);margin:0;">Ustad</p>
      <p style="font-size:11px;color:rgba(232,224,212,.38);margin:7px 0 0;letter-spacing:.06em;">ustadcontact@gmail.com &nbsp;·&nbsp; +33 6 61 50 54 54</p>
      <p style="font-size:9px;color:rgba(232,224,212,.22);margin:16px 0 0;line-height:1.6;letter-spacing:.04em;">Ce bon de commande est généré automatiquement lors de votre réservation en ligne.<br>© ${new Date().getFullYear()} Ustad — Savoir-Faire in Motion</p>
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

  const vehLabel = { berline:'Berline — Classe E', van:'Van — Classe V', classe_s:'Berline — Classe S' }[veh] || veh;
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
    // Reset
    APP_STATE.cabin = 0; APP_STATE.large = 0; APP_STATE.partner = false;
  });
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

  // Récupérer les trajets
  let trajetsText = '';
  document.querySelectorAll('.trip').forEach((card, i) => {
    const dep    = card.querySelector('[data-ac="dep"]')?.value  || '—';
    const arr    = card.querySelector('[data-ac="arr"]')?.value  || '—';
    const date   = card.querySelectorAll('input[type=date]')[0]?.value  || '—';
    const time   = card.querySelectorAll('input[type=time]')[0]?.value  || '—';
    const pax    = card.querySelector('select')?.value            || '—';
    const vType  = card.querySelectorAll('select')[1]?.value      || '—';
    const pnames = card.querySelector('input[type=text]:not([data-ac])')?.value || '—';
    trajetsText += `\nTrajet ${i+1}: ${date} ${time} | ${dep} → ${arr} | ${pax} pax | ${vType}\nPassagers: ${pnames}\n`;
  });

  const ref = makeRef();
  const now = new Date().toLocaleString(fr ? 'fr-FR' : 'en-GB');

  const bdc = `
╔══════════════════════════════════════════╗
║   BON DE COMMANDE ENTREPRISE — USTAD     ║
╚══════════════════════════════════════════╝

Référence       : ${ref}
Date de demande : ${now}

─── ENTREPRISE ─────────────────────────────
Société         : ${company}
Contact         : ${contact}
Email           : ${email}
Téléphone       : ${phone || '—'}

─── TRAJETS ────────────────────────────────
${trajetsText}
─── DOCUMENT JOINT ─────────────────────────
${document.getElementById('ent-fname')?.textContent || '—'}

──────────────────────────────────────────
USTAD · ustadcontact@gmail.com
`.trim();

  _sendEmail(CFG.emailjs_template_ent, {
    from_name:  `${company} — ${contact}`,
    from_email: email,
    reply_to:   email,
    to_name:    'Équipe Ustad',
    message:    bdc,
  }, (emailSent) => {
    showConfirmation({
      ref, now,
      fname: contact, lname: '', email, phone,
      type:  fr ? 'Entreprise' : 'Enterprise',
      date:  now,
      pickup: fr ? 'Voir les trajets dans l\'e-mail' : 'See journeys in e-mail',
      dest:  '—',
      veh:   '—',
      pax:   '—',
      notes: '',
      price: fr ? 'Sur devis' : 'Quote',
      emailSent,
      emailHtml: bdc,
    });
    APP_STATE.trips = 0;
  });
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
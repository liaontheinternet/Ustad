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
  const map = { now:'Trajet minute', planned:'Trajet planifié', hourly:'À l\'heure', enterprise:'Entreprise' };
  return map[APP_STATE.tab] || APP_STATE.tab;
}

/* ─── Génération du bon de commande HTML stylisé ─── */
function genEmailHtml({ ref, now, fname, lname, email, phone, type, dateLabel, pickup, dest, vehLabel, pax, cabin, large, baby, partner, notes, prix }) {
  const s = {
    wrap:       'max-width:620px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;',
    banner:     'background-color:#0D1B2A !important;padding:32px 40px 28px;border-bottom:3px solid #8B1A1A;',
    logo:       'font-family:Georgia,serif;font-size:24px;letter-spacing:.32em;text-transform:uppercase;color:#F5F0E8;margin:0;font-weight:normal;',
    sub:        'font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(232,224,212,.42);margin-top:5px;',
    metaWrap:   'margin-top:24px;',
    refLbl:     'font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,212,.65);',
    refVal:     'font-size:14px;letter-spacing:.12em;color:#F5F0E8;font-weight:bold;',
    date:       'font-size:10px;color:rgba(232,224,212,.45);letter-spacing:.06em;margin-top:6px;',
    main:       'background-color:#F5F0E8 !important;padding:32px 40px 24px;',
    intro:      'font-size:13px;color:rgba(13,27,42,.62);line-height:1.7;margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid rgba(13,27,42,.10);',
    block:      'border:1px solid #8B1A1A;margin-bottom:14px;',
    bhead:      'background-color:#8B1A1A !important;padding:9px 16px;',
    bheadSpan:  'font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#F5F0E8;font-weight:normal;',
    row:        'display:flex;align-items:baseline;padding:9px 16px;border-bottom:1px solid rgba(13,27,42,.07);',
    rowLast:    'display:flex;align-items:baseline;padding:9px 16px;',
    lbl:        'font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(13,27,42,.45);width:38%;padding-right:12px;',
    val:        'font-size:13px;color:#0D1B2A;font-weight:600;line-height:1.4;',
    priceBlock: 'border:1px solid #8B1A1A;background-color:rgba(139,26,26,.05) !important;margin-bottom:14px;padding:22px 16px;display:flex;align-items:center;justify-content:space-between;',
    priceLbl:   'font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#8B1A1A;',
    priceNote:  'font-size:10px;color:rgba(13,27,42,.40);margin-top:5px;line-height:1.5;',
    priceVal:   'font-size:32px;color:#0D1B2A;font-weight:700;letter-spacing:-.01em;',
    footer:     'background-color:#0D1B2A !important;padding:24px 40px;border-top:3px solid #8B1A1A;text-align:center;',
    flogo:      'font-family:Georgia,serif;font-size:14px;letter-spacing:.32em;text-transform:uppercase;color:rgba(232,224,212,.58);',
    fcontact:   'font-size:11px;color:rgba(232,224,212,.38);margin-top:8px;letter-spacing:.06em;',
    flegal:     'font-size:9px;color:rgba(232,224,212,.22);margin-top:18px;line-height:1.6;letter-spacing:.04em;',
  };

  const row = (label, value, last = false) =>
    `<div style="${last ? s.rowLast : s.row}"><span style="${s.lbl}">${label}</span><span style="${s.val}">${value || '—'}</span></div>`;

  const notesBlock = notes ? `
    <div style="${s.block}">
      <div style="${s.bhead}"><span style="${s.bheadSpan}">Demandes spéciales</span></div>
      <div><div style="${s.rowLast}"><span style="${s.val}">${notes}</span></div></div>
    </div>` : '';

  return `<!DOCTYPE html><html lang="fr" style="color-scheme:light;" data-color-mode="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>Bon de commande Ustad — ${ref}</title><style>:root{color-scheme:light only !important;}body,div,table,td,th,p,span{color-scheme:light !important;}</style></head>
<body style="margin:0;padding:0;background-color:#c5bdb4 !important;color-scheme:light;">
<div style="${s.wrap}">

  <div style="${s.banner}">
    <div style="${s.logo}">Ustad</div>
    <div style="${s.sub}">Savoir-Faire in Motion</div>
    <div style="${s.metaWrap}">
      <div style="${s.refLbl}">Référence</div>
      <div style="${s.refVal}">${ref}</div>
      <div style="${s.date}">${now}</div>
    </div>
  </div>

  <div style="${s.main}">
    <p style="${s.intro}">Bonjour ${fname},<br>Votre demande de réservation a bien été transmise à l'équipe Ustad. Un conseiller vous contactera très prochainement pour confirmer votre trajet.</p>

    <div style="${s.block}">
      <div style="${s.bhead}"><span style="${s.bheadSpan}">Client</span></div>
      <div>
        ${row('Nom', `${fname} ${lname}`)}
        ${row('E-mail', email)}
        ${row('Téléphone', phone, true)}
      </div>
    </div>

    <div style="${s.block}">
      <div style="${s.bhead}"><span style="${s.bheadSpan}">Prestation</span></div>
      <div>
        ${row('Type', type)}
        ${row('Date &amp; heure', dateLabel)}
        ${row('Prise en charge', pickup)}
        ${row('Destination', dest)}
        ${row('Véhicule', vehLabel)}
        ${row('Passagers', pax, true)}
      </div>
    </div>

    <div style="${s.block}">
      <div style="${s.bhead}"><span style="${s.bheadSpan}">Bagages &amp; Options</span></div>
      <div>
        ${row('Bagages cabine', cabin)}
        ${row('Grandes valises', large)}
        ${row('Siège bébé', baby ? 'Oui' : 'Non')}
        ${row('Code partenaire', partner ? 'USTADHOTELS' : '—', true)}
      </div>
    </div>

    <div style="${s.priceBlock}">
      <div>
        <div style="${s.priceLbl}">Tarif estimé</div>
        <div style="${s.priceNote}">Tarif indicatif<br>Confirmation par l'équipe Ustad</div>
      </div>
      <div style="${s.priceVal}">${prix}</div>
    </div>

    ${notesBlock}
  </div>

  <div style="${s.footer}">
    <div style="${s.flogo}">Ustad</div>
    <div style="${s.fcontact}">ustadcontact@gmail.com &nbsp;·&nbsp; +33 6 61 50 54 54</div>
    <div style="${s.flegal}">Ce bon de commande est généré automatiquement lors de votre réservation en ligne.<br>© ${new Date().getFullYear()} Ustad — Savoir-Faire in Motion</div>
  </div>

</div>
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
  if (APP_STATE.tab !== 'hourly' && !dest) {
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
    dest:      APP_STATE.tab === 'hourly' ? '(À l\'heure — sans destination fixe)' : dest,
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
      dest:  APP_STATE.tab === 'hourly' ? '—' : dest,
      veh:   vehLabel,
      pax,
      notes,
      price: prix,
      emailSent,
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
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
  const map = { now:'À la demande', planned:'Planifiée', hourly:'À l\'heure', enterprise:'Entreprise' };
  return map[APP_STATE.tab] || APP_STATE.tab;
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

  // Bon de commande
  const bdc = `
╔══════════════════════════════════════════╗
║       BON DE COMMANDE — USTAD            ║
╚══════════════════════════════════════════╝

Référence       : ${ref}
Date de demande : ${now}

─── CLIENT ────────────────────────────────
Nom             : ${fname} ${lname}
Email           : ${email}
Téléphone       : ${phone || '—'}

─── PRESTATION ────────────────────────────
Type            : ${tabLabel()}
Date & Heure    : ${dateLabel}
Prise en charge : ${pickup}
Destination     : ${APP_STATE.tab === 'hourly' ? '(À l\'heure — sans destination fixe)' : dest}
Véhicule        : ${vehLabel}
Passagers       : ${pax}
Bagages cabine  : ${APP_STATE.cabin}
Grandes valises : ${APP_STATE.large}
Siège bébé      : ${baby ? 'Oui' : 'Non'}
Code partenaire : ${APP_STATE.partner ? 'USTADHOTELS' : '—'}

─── TARIF ESTIMÉ ──────────────────────────
${prix}
(Tarif indicatif — confirmation par l'équipe Ustad)

─── DEMANDES SPÉCIALES ────────────────────
${notes || '—'}

──────────────────────────────────────────
USTAD · ustadcontact@gmail.com
`.trim();

  _sendEmail(CFG.emailjs_template_std, {
    to_email:   CFG.email_reception,
    subject:    `[${ref}] Nouvelle demande — ${fname} ${lname}`,
    bdc:        bdc,
    client_email: email,
    ref:        ref,
  }, () => {
    showConfirmation({
      pickup: pickup,
      dest:   APP_STATE.tab === 'hourly' ? '—' : dest,
      veh:    vehLabel,
      pax:    pax,
      date:   dateLabel,
      price:  prix,
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
    to_email:   CFG.email_reception,
    subject:    `[${ref}] Demande Entreprise — ${company}`,
    bdc:        bdc,
    client_email: email,
    ref:        ref,
  }, () => {
    showConfirmation({
      pickup: '(voir trajets ci-dessous)',
      dest:   '—',
      veh:    '—',
      pax:    '—',
      date:   now,
      price:  'Sur devis',
    });
    APP_STATE.trips = 0;
  });
}

/* ─── Envoi EmailJS ─── */
function _sendEmail(templateId, params, onSuccess) {
  const fr = APP_STATE.lang === 'fr';
  const btn = document.getElementById('btn-sub-std') || document.getElementById('btn-sub-ent');
  if (btn) { btn.disabled = true; btn.textContent = fr ? 'Envoi en cours…' : 'Sending…'; }

  if (typeof emailjs === 'undefined' || CFG.emailjs_service_id === 'YOUR_SERVICE_ID') {
    // EmailJS non configuré — mode démo
    console.warn('EmailJS non configuré. Bon de commande :', params.bdc);
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Confirmer la réservation' : 'Confirm booking'; }
      onSuccess();
    }, 800);
    return;
  }

  emailjs.send(CFG.emailjs_service_id, templateId, params, CFG.emailjs_public_key)
    .then(() => {
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Confirmer la réservation' : 'Confirm booking'; }
      onSuccess();
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      if (btn) { btn.disabled = false; btn.textContent = fr ? 'Confirmer la réservation' : 'Confirm booking'; }
      alert(fr ? 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.' : 'An error occurred. Please try again or contact us directly.');
    });
}
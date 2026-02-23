/* ════════════════════════════════════════════
   ÉCRAN DE CONFIRMATION POST-RÉSERVATION
════════════════════════════════════════════ */

function showConfirmation(data) {
  const wrap   = document.getElementById('conf-wrap');
  const inner  = document.getElementById('conf-inner');
  const std    = document.getElementById('std');
  const ent    = document.getElementById('ent');
  const tabsEl = document.querySelector('.tabs');

  if (std)    std.style.display    = 'none';
  if (ent)    ent.style.display    = 'none';
  if (tabsEl) tabsEl.style.display = 'none';
  if (!wrap || !inner) return;
  wrap.style.display = 'block';

  const fr  = APP_STATE.lang === 'fr';
  const ref = data.ref || ('UST-' + Math.random().toString(36).substring(2,8).toUpperCase());
  const now = data.now || new Date().toLocaleString(fr ? 'fr-FR' : 'en-GB');

  /* ── Helpers ── */
  const row = (lbl, val) => {
    if (!val || val === '—') return '';
    return `<div class="bdc-row"><span class="bdc-lbl">${lbl}</span><span class="bdc-val">${val}</span></div>`;
  };

  const block = (title, rowsHtml) => rowsHtml ? `
    <div class="bdc-block">
      <div class="bdc-bhead"><span>${title}</span></div>
      <div class="bdc-bbody">${rowsHtml}</div>
    </div>` : '';

  const clientBlock = block(
    fr ? 'Client' : 'Client',
    row(fr ? 'Nom' : 'Name', [data.fname, data.lname].filter(Boolean).join(' ')) +
    row('E-mail', data.email) +
    row(fr ? 'Téléphone' : 'Phone', data.phone)
  );

  const prestationBlock = block(
    fr ? 'Prestation' : 'Journey',
    row(fr ? 'Type' : 'Type', data.type) +
    row(fr ? 'Date &amp; heure' : 'Date &amp; time', data.date) +
    row(fr ? 'Prise en charge' : 'Pickup', data.pickup) +
    row(fr ? 'Destination' : 'Destination', data.dest) +
    row(fr ? 'Véhicule' : 'Vehicle', data.veh) +
    row(fr ? 'Passagers' : 'Passengers', String(data.pax))
  );

  const notesBlock = data.notes ? block(
    fr ? 'Demandes spéciales' : 'Special requests',
    `<div class="bdc-row"><span class="bdc-val">${data.notes}</span></div>`
  ) : '';

  const warnHtml = data.emailSent === false
    ? `<div class="bdc-warn">${fr ? 'E-mail non envoyé — appelez-nous si besoin.' : 'E-mail not sent — please call us if needed.'}</div>`
    : '';

  inner.innerHTML = `
    <div class="bdc-banner">
      <div class="bdc-logo">Ustad</div>
      <div class="bdc-sub">Savoir-Faire in Motion</div>
      <div class="bdc-meta">
        <div class="bdc-ref-lbl">${fr ? 'Référence' : 'Reference'}</div>
        <div class="bdc-ref-val">${ref}</div>
        <div class="bdc-date">${now}</div>
      </div>
    </div>

    <div class="bdc-body">
      <div class="bdc-intro">
        <div class="bdc-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="bdc-intro-text">
          <div class="bdc-intro-title">${fr ? 'Réservation transmise' : 'Booking submitted'}</div>
          <div class="bdc-intro-sub">${fr
            ? 'Un conseiller Ustad vous contactera très prochainement pour confirmer votre trajet.'
            : 'An Ustad advisor will contact you shortly to confirm your journey.'}</div>
          ${warnHtml}
        </div>
      </div>

      ${clientBlock}
      ${prestationBlock}

      <div class="bdc-price-block">
        <div>
          <div class="bdc-price-lbl">${fr ? 'Tarif estimé' : 'Estimated fare'}</div>
          <div class="bdc-price-note">${fr
            ? 'Tarif indicatif · Confirmation par l\'équipe Ustad'
            : 'Indicative rate · Confirmation by Ustad team'}</div>
        </div>
        <div class="bdc-price-val">${data.price || '—'}</div>
      </div>

      ${notesBlock}

      <div class="bdc-actions">
        <button id="conf-pdf" class="conf-btn-pdf" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          ${fr ? 'Télécharger PDF' : 'Download PDF'}
        </button>
        <button id="conf-new" class="conf-btn-new" type="button">
          ${fr ? 'Nouvelle réservation' : 'New booking'}
        </button>
        <a class="conf-btn-contact" href="tel:+33661505454">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.1 10.82a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>
          </svg>
          ${fr ? 'Appeler' : 'Call us'}
        </a>
        <a class="conf-btn-contact" href="mailto:ustadcontact@gmail.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          ${fr ? 'Nous écrire' : 'Write to us'}
        </a>
      </div>
    </div>

    <div class="bdc-footer">
      <div class="bdc-footer-logo">Ustad</div>
      <div class="bdc-footer-contact">ustadcontact@gmail.com &nbsp;·&nbsp; +33 6 61 50 54 54</div>
    </div>
  `;

  document.getElementById('conf-new')?.addEventListener('click', () => {
    wrap.style.display = 'none';
    if (std)    std.style.display    = 'block';
    if (tabsEl) tabsEl.style.display = '';
  });

  document.getElementById('conf-pdf')?.addEventListener('click', () => {
    const btn = document.getElementById('conf-pdf');
    const card = document.getElementById('conf-inner');
    if (!card) return;

    if (btn) {
      btn.disabled = true;
      btn.textContent = fr ? 'Génération…' : 'Generating…';
    }

    html2pdf().set({
      margin:     [8, 8, 8, 8],
      filename:   `Ustad-BDC-${data.ref || 'reservation'}.pdf`,
      image:      { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: null },
      jsPDF:      { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(card).save().then(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${fr ? 'Télécharger PDF' : 'Download PDF'}`;
      }
    });
  });
}

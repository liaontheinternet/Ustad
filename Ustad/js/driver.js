/* ════════════════════════════════════════════
   SECTION RECRUTEMENT (Driver)
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Affichage du nom du fichier CV
  document.getElementById('btn-attach-driver')?.addEventListener('click', () => {
    document.getElementById('d-cv')?.click();
  });

  document.getElementById('d-cv')?.addEventListener('change', (e) => {
    const el = document.getElementById('d-cvname');
    if (el && e.target.files && e.target.files[0]) {
      el.style.display = 'block';
      el.textContent = '📎 ' + e.target.files[0].name;
    }
  });

  // Soumission
  document.getElementById('btn-submit-driver')?.addEventListener('click', submitDriver);
});

function submitDriver() {
  const fname = document.getElementById('d-fname')?.value.trim() || '';
  const lname = document.getElementById('d-lname')?.value.trim() || '';
  const phone = document.getElementById('d-phone')?.value.trim() || '';
  const email = document.getElementById('d-email')?.value.trim() || '';
  const motiv = document.getElementById('d-motiv')?.value.trim() || '';
  const cv = document.getElementById('d-cv')?.files.length || 0;

  if (!fname || !lname || !phone || !email || !motiv || !cv) {
    alert(APP_STATE.lang === 'fr'
      ? 'Tous les champs sont obligatoires, y compris votre CV.'
      : 'All fields are required, including your CV.');
    return;
  }

  if (!document.getElementById('rgpd-drv-chk')?.checked) {
    document.getElementById('rgpd-drv')?.classList.add('rgpd-err');
    alert(APP_STATE.lang === 'fr'
      ? 'Veuillez accepter la politique de confidentialité.'
      : 'Please accept the privacy policy.');
    return;
  }

  document.getElementById('rgpd-drv')?.classList.remove('rgpd-err');

  alert(APP_STATE.lang === 'fr'
    ? '✓ Candidature transmise. Nous reviendrons vers vous si votre profil correspond à nos critères.'
    : '✓ Application submitted. We will be in touch if your profile matches our criteria.');
}

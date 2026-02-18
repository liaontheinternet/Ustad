/* ════════════════════════════════════════════
   GESTION DES MODALES (Légales, Privacy)
════════════════════════════════════════════ */

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Boutons de fermeture
  document.getElementById('btn-close-legal')?.addEventListener('click', () => closeModal('legal'));
  document.getElementById('btn-close-privacy')?.addEventListener('click', () => closeModal('privacy'));

  // Liens d'ouverture
  document.getElementById('link-legal')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('legal');
  });

  document.getElementById('link-privacy')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacy');
  });

  document.getElementById('link-privacy-std')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacy');
  });

  document.getElementById('link-privacy-ent')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacy');
  });

  document.getElementById('link-privacy-driver')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacy');
  });

  // Fermer en cliquant sur le fond
  ['legal', 'privacy'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(id);
      });
    }
  });
});
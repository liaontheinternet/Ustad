/* ════════════════════════════════════════════
   GESTION DE LA LANGUE (FR/EN)
════════════════════════════════════════════ */

function setLang(l) {
  lang = l;

  // Highlight button
  document.querySelectorAll('.nav-lang button').forEach(b => {
    b.classList.toggle('on', b.getAttribute('data-lang') === l);
  });

  // Translate text
  document.querySelectorAll('[data-fr]').forEach(el => {
    const text = el.getAttribute('data-' + l);
    if (text) el.innerHTML = text;
  });

  // Translate placeholders
  document.querySelectorAll('input[data-fr-placeholder], textarea[data-fr-placeholder]').forEach(el => {
    const placeholder = el.getAttribute('data-' + l + '-placeholder');
    if (placeholder) el.placeholder = placeholder;
  });

  // Translate select options
  document.querySelectorAll('select option[data-fr]').forEach(el => {
    const text = el.getAttribute('data-' + l);
    if (text) el.textContent = text;
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-fr')?.addEventListener('click', () => setLang('fr'));
  document.getElementById('btn-en')?.addEventListener('click', () => setLang('en'));
});
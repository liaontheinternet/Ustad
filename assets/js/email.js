/* ════════════════════════════════════════════
   E-MAIL DE RÉSERVATION · même esthétique que le site
   Ivoire, encre, accent bordeaux, titres en serif.
   Mise en page en tableaux + styles en ligne (Gmail, Outlook, Apple Mail).
════════════════════════════════════════════ */
function ustadEmailHtml(d) {
  const IVORY = '#F7F4EE', PAPER = '#FFFFFF', INK = '#15171A', MUTED = '#6E6A64', LINE = '#E6E1D8', ACCENT = '#7A1C1C', NIGHT = '#0D1B2A';
  const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const SANS = "'DM Sans', Helvetica, Arial, sans-serif";
  const LOGO = "'Lexend Zetta', Helvetica, Arial, sans-serif";
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const multi = s => e(s).replace(/\n/g, '<br>');

  const row = (label, value, last) => !value ? '' : `
          <tr>
            <td width="150" valign="top" style="width:150px;padding:13px 0;${last ? '' : `border-bottom:1px solid ${LINE};`}font:500 10px/1.4 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">${label}</td>
            <td valign="top" style="padding:13px 0;${last ? '' : `border-bottom:1px solid ${LINE};`}font:400 15px/1.5 ${SANS};color:${INK};">${value}</td>
          </tr>`;

  const section = (title, rows) => `
      <tr><td style="padding:26px 36px 4px;">
        <p style="margin:0 0 4px;font:500 10px/1 ${SANS};letter-spacing:.24em;text-transform:uppercase;color:${MUTED};">${title}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}
        </table>
      </td></tr>`;

  return `<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>Réservation ${e(d.ref)} · Ustad</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=DM+Sans:wght@400;500&family=Lexend+Zetta:wght@300&display=swap" rel="stylesheet">
<style>:root{color-scheme:light only}@media (max-width:620px){.px{padding-left:22px!important;padding-right:22px!important}}</style>
</head>
<body style="margin:0;padding:0;background:${IVORY};" bgcolor="${IVORY}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${IVORY}" style="background:${IVORY};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

    <tr><td align="center" style="padding:6px 0 26px;">
      <p style="margin:0;font:300 22px/1 ${LOGO};letter-spacing:.32em;text-transform:uppercase;color:${INK};">USTAD</p>
      <p style="margin:8px 0 0;font:400 9px/1 ${SANS};letter-spacing:.32em;text-transform:uppercase;color:${MUTED};">Savoir-Faire in Motion</p>
    </td></tr>

    <tr><td bgcolor="${PAPER}" style="background:${PAPER};border:1px solid ${LINE};border-radius:14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

        <tr><td class="px" style="padding:34px 36px 6px;">
          <p style="margin:0 0 10px;font:500 10px/1 ${SANS};letter-spacing:.24em;text-transform:uppercase;color:${MUTED};">Demande de réservation · ${e(d.ref)}</p>
          <h1 style="margin:0;font:400 34px/1.1 ${SERIF};color:${INK};">Bonjour ${e(d.fname)},<br><em style="font-style:italic;color:${ACCENT};">votre trajet est entre de bonnes mains.</em></h1>
          <p style="margin:16px 0 0;font:400 15px/1.6 ${SANS};color:${MUTED};">Votre demande a bien été transmise à l'équipe Ustad. Un conseiller vous recontacte très vite pour confirmer votre trajet.</p>
        </td></tr>

        <tr><td class="px" style="padding:24px 36px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${IVORY}" style="background:${IVORY};border-radius:10px;">
            <tr>
              <td style="padding:18px 20px;">
                <p style="margin:0;font:500 10px/1 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:${MUTED};">${e(d.vehLabel)} · ${e(d.pax)} passager${+d.pax > 1 ? 's' : ''}</p>
                <p style="margin:8px 0 0;font:400 14px/1.4 ${SANS};color:${INK};">${e(d.dateLabel)}</p>
              </td>
              <td align="right" style="padding:18px 20px;font:400 34px/1 ${SERIF};color:${INK};white-space:nowrap;">${e(d.prix)}</td>
            </tr>
          </table>
          <p style="margin:8px 2px 0;font:400 12px/1.5 ${SANS};color:${MUTED};">${e(d.priceNote || 'Prix tout compris, confirmé par Ustad.')}</p>
        </td></tr>

        ${section('Trajet',
          row('Départ', e(d.pickup)) +
          row('Arrivée', e(d.dest)) +
          row('N° de vol', e(d.flight)) +
          row('Demandes', multi(d.requests), true))}

        ${section('Client',
          row('Nom', e(d.fname + ' ' + d.lname)) +
          row('Téléphone', `<a href="tel:${e(String(d.phone).replace(/\s/g, ''))}" style="color:${INK};text-decoration:none;">${e(d.phone)}</a>`) +
          row('E-mail', `<a href="mailto:${e(d.email)}" style="color:${INK};text-decoration:none;">${e(d.email)}</a>`, true))}

        <tr><td class="px" style="padding:28px 36px 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td bgcolor="${INK}" style="background:${INK};border-radius:8px;">
              <a href="https://wa.me/33661505454" style="display:inline-block;padding:13px 22px;font:500 14px/1 ${SANS};color:#FFFFFF;text-decoration:none;">Une question ? WhatsApp</a>
            </td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>

    <tr><td style="padding:26px 10px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${NIGHT}" style="background:${NIGHT};border-radius:14px;">
        <tr><td align="center" style="padding:24px 20px;">
          <p style="margin:0;font:400 13px/1.7 ${SANS};color:rgba(255,255,255,.82);">+33 6 61 50 54 54 &nbsp;·&nbsp; ustadcontact@gmail.com &nbsp;·&nbsp; ustad.pro</p>
          <p style="margin:8px 0 0;font:400 11px/1.6 ${SANS};color:rgba(255,255,255,.5);">USTAD SASU · 27 avenue Jean Médecin, 06000 Nice · Demande reçue le ${e(d.now)}</p>
        </td></tr>
      </table>
    </td></tr>

  </table>
</td></tr>
</table>
</body></html>`;
}

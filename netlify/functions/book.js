/* ════════════════════════════════════════════════════════
   NETLIFY FUNCTION — Création d'un événement Google Calendar
   Appelée après chaque soumission du formulaire de réservation
════════════════════════════════════════════════════════ */

const { google } = require('googleapis');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const {
      ref, fname, lname, email, phone,
      type, pickup, dest, vehLabel, pax, notes, prix,
      bdt, dur, tab,
    } = JSON.parse(event.body);

    // ── Authentification Service Account ──
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({ version: 'v3', auth });

    // ── Calcul des dates ──
    let startDt, endDt;

    if (tab === 'planned' && bdt) {
      // Réservation planifiée : utiliser la date/heure du formulaire
      startDt = new Date(bdt);
      endDt   = new Date(startDt.getTime() + 2 * 3600 * 1000); // +2h par défaut
    } else if (tab === 'hourly' && dur) {
      // À l'heure : prochaine heure ronde, durée selon champ "dur"
      startDt = new Date();
      startDt.setHours(startDt.getHours() + 1, 0, 0, 0);
      endDt   = new Date(startDt.getTime() + parseFloat(dur) * 3600 * 1000);
    } else {
      // À la demande (ASAP) : demain à 10h, durée 2h
      startDt = new Date();
      startDt.setDate(startDt.getDate() + 1);
      startDt.setHours(10, 0, 0, 0);
      endDt   = new Date(startDt.getTime() + 2 * 3600 * 1000);
    }

    // ── Description de l'événement ──
    const description = [
      `Référence     : ${ref}`,
      `Client        : ${fname} ${lname}`,
      phone          ? `Téléphone     : ${phone}`              : null,
      `Email         : ${email}`,
      `Type          : ${type}`,
      `Prise en charge : ${pickup}`,
      `Destination   : ${dest}`,
      `Véhicule      : ${vehLabel}`,
      `Passagers     : ${pax}`,
      notes          ? `Demandes spéciales : ${notes}`         : null,
      `Tarif estimé  : ${prix}`,
    ].filter(Boolean).join('\n');

    // ── Création de l'événement ──
    await calendar.events.insert({
      calendarId:  process.env.GOOGLE_CALENDAR_ID || 'primary',
      sendUpdates: 'none',
      requestBody: {
        summary:     `Réservation Ustad — ${fname} ${lname} [${ref}]`,
        description,
        start:       { dateTime: startDt.toISOString(), timeZone: 'Europe/Paris' },
        end:         { dateTime: endDt.toISOString(),   timeZone: 'Europe/Paris' },
        status:      'confirmed',
        reminders: {
          useDefault: false,
          overrides:  [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    });

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('Calendar error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};

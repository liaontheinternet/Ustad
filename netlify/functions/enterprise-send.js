/* ════════════════════════════════════════════════════════
   NETLIFY FUNCTION — Envoi e-mail entreprise avec pièce jointe
   Remplace l'appel EmailJS pour le formulaire Entreprise afin
   de permettre l'envoi de PDF (cahier des charges, budget…)

   Env vars requises dans Netlify (Site settings → Env variables) :
     GMAIL_USER          → ustadcontact@gmail.com
     GMAIL_APP_PASSWORD  → Mot de passe d'application Gmail
                           (Compte Google → Sécurité → Mots de passe des applications)
════════════════════════════════════════════════════════ */

const nodemailer = require('nodemailer');

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type':                 'application/json',
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
      ref, company, contact, email, phone,
      trajets,          // tableau de strings déjà formatées
      notes,
      htmlBody,         // bon de commande HTML stylisé généré côté client
      fileBase64,       // string base64 (sans le préfixe data:…)
      fileName,         // nom du fichier d'origine
    } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const attachments = [];
    if (fileBase64 && fileName) {
      attachments.push({
        filename: fileName,
        content:  fileBase64,
        encoding: 'base64',
      });
    }

    await transporter.sendMail({
      from:        `"Ustad — Réservations" <${process.env.GMAIL_USER}>`,
      to:          process.env.GMAIL_USER,
      replyTo:     email,
      subject:     `Demande Entreprise — ${company} [${ref}]`,
      html:        htmlBody,
      attachments,
    });

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('Enterprise send error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};

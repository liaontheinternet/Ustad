/* ════════════════════════════════════════════
   CONFIGURATION CENTRALISÉE
════════════════════════════════════════════ */

const CFG = {
  // Email de réception
  email_reception: 'ustadcontact@gmail.com',

  // WhatsApp — numéro international sans espaces ni +
  whatsapp_numero: '33661505454',

  // EmailJS
  emailjs_service_id:   'YOUR_SERVICE_ID',
  emailjs_template_std: 'YOUR_TEMPLATE_STD',
  emailjs_template_ent: 'YOUR_TEMPLATE_ENT',
  emailjs_public_key:   'YOUR_PUBLIC_KEY',
};

/* ════ TARIFS FIXES PARTENAIRES HÔTELS ════ */
const TARIFS_HOTEL = {
  'aeroport':    {b:40,  v:70,  s:100},
  'airport':     {b:40,  v:70,  s:100},
  'gare nice':   {b:25,  v:40,  s:100},
  'monaco':      {b:110, v:130, s:150},
  'cannes':      {b:110, v:130, s:150},
  'villefranche':{b:60,  v:80,  s:130},
  'beaulieu':    {b:70,  v:100, s:150},
  'cap ferrat':  {b:70,  v:100, s:150},
  'vence':       {b:70,  v:100, s:150},
  'antibes':     {b:90,  v:110, s:150},
  'sophia':      {b:90,  v:110, s:150},
  'eze':         {b:80,  v:100, s:150},
  'menton':      {b:130, v:150, s:180},
  'grasse':      {b:130, v:150, s:180},
  'vintimille':  {b:170, v:230, s:250},
  'frejus':      {b:200, v:250, s:260},
  'san remo':    {b:200, v:250, s:300},
  'isola 2000':  {b:250, v:300, s:350},
  'st-tropez':   {b:350, v:400, s:450},
  'saint-tropez':{b:350, v:400, s:450},
  'marseille':   {b:500, v:600, s:700},
};

/* ════ TARIFS AU KILOMÈTRE ════ */
const TARIFS_KM = { berline: 3, van: 4, classe_s: 4.5 };

/* ════ TARIFS À L'HEURE ════ */
const TARIFS_HEURE = { berline: 90, van: 110, classe_s: 115 };

/* ════ ÉTAT GLOBAL ════ */
const APP_STATE = {
  lang:       'fr',
  tab:        'now',
  cabin:      0,
  large:      0,
  partner:    false,
  trips:      0,
  coordCache: {},
  priceTimer: null,
};
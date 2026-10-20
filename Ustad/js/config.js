/* ════════════════════════════════════════════
   CONFIGURATION CENTRALISÉE
════════════════════════════════════════════ */

const CFG = {
  // Email de réception
  email_reception: 'ustadcontact@gmail.com',

  // WhatsApp — numéro international sans espaces ni +
  whatsapp_numero: '33661505454',

  // EmailJS
  emailjs_service_id:   'service_adlzlv7',
  emailjs_template_std: 'template_te2tcuu',
  emailjs_template_ent: 'template_te2tcuu',
  emailjs_public_key:   'Cg_-rym5ScOdhBeAv',

  // Google Maps (Places Autocomplete)
  maps_key: 'AIzaSyAhFyxtMNjcF83u79TB0s4P0oiLd0ntb7I',
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
  tab:        'planned',
  cabin:      0,
  large:      0,
  partner:    false,
  trips:      0,
  coordCache: {},
  priceTimer: null,
};

/* ════════════════════════════════════════════
   GRILLE PRESTIGE (site v2, index.html)
   Référence marché Côte d'Azur 2026 : chauffeurs Mercedes Classe E / Classe V
   Toutes les valeurs sont modifiables ici, sans toucher au reste du code.
════════════════════════════════════════════ */
const PRESTIGE = {
  // Trajets hors forfait : prise en charge + prix au km, avec un minimum
  formule: {
    berline: { base: 35, km: 3.0, min: 70 },
    van:     { base: 45, km: 3.6, min: 90 },
  },

  // Majoration de nuit (heure de prise en charge)
  nuit: { debut: 22, fin: 6, majoration: 0.20 },

  // Aéroport Nice Côte d'Azur (rayon en km)
  aeroport: { lat: 43.6584, lon: 7.2159, r: 2.5 },

  // Forfaits aéroport <-> zone, dans les deux sens.
  // L'ordre compte : la première zone qui contient l'adresse l'emporte.
  forfaits: [
    { zone: 'Villefranche · Beaulieu · Cap-Ferrat', lat: 43.700, lon: 7.325, r: 2.8, berline: 100, van: 120 },
    { zone: 'Èze',                                  lat: 43.728, lon: 7.362, r: 2.5, berline: 110, van: 130 },
    { zone: 'Monaco',                               lat: 43.738, lon: 7.425, r: 3,   berline: 130, van: 150 },
    { zone: 'Menton',                               lat: 43.777, lon: 7.505, r: 3,   berline: 150, van: 180 },
    { zone: 'Antibes · Juan-les-Pins',              lat: 43.577, lon: 7.115, r: 4,   berline: 100, van: 120 },
    { zone: 'Cannes',                               lat: 43.553, lon: 7.017, r: 4,   berline: 120, van: 140 },
    { zone: 'Sophia Antipolis',                     lat: 43.616, lon: 7.055, r: 3,   berline: 100, van: 120 },
    { zone: 'Saint-Paul-de-Vence · Vence',          lat: 43.705, lon: 7.115, r: 4,   berline: 100, van: 120 },
    { zone: 'Grasse',                               lat: 43.659, lon: 6.924, r: 4,   berline: 130, van: 160 },
    { zone: 'Saint-Tropez · Ramatuelle',            lat: 43.245, lon: 6.630, r: 7,   berline: 380, van: 450 },
    { zone: 'Nice',                                 lat: 43.701, lon: 7.268, r: 5,   berline: 80,  van: 100 },
  ],
};

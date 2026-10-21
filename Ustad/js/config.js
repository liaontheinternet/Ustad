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
   GRILLE TARIFAIRE USTAD (site v2, index.html)
   Source : grille « Tarifs transferts depuis Nice » fournie par Ustad.
   Toutes les valeurs sont modifiables ici, sans toucher au reste du code.
════════════════════════════════════════════ */
const PRESTIGE = {
  // Trajets hors grille : prise en charge + prix au km, avec un minimum
  formule: {
    berline:  { base: 35, km: 3.0, min: 70 },
    van:      { base: 45, km: 3.6, min: 90 },
    classe_s: { base: 50, km: 4.5, min: 100 },
  },

  // Suppléments (s'ajoutent à tous les trajets)
  supplements: {
    priseEnCharge: 10,              // départ depuis l'aéroport, le port ou la gare
    nuit: 10, nuitAvant: 7, nuitApres: 20, // départ avant 7 h ou à partir de 20 h
  },

  // Tours privés (mise à disposition), prix à l'heure
  heure: { berline: 100, van: 110, classe_s: 150 },

  // Lieux de prise en charge donnant droit au supplément (rayon en km)
  aeroport: { lat: 43.6584, lon: 7.2159, r: 2.5 },
  gare:     { lat: 43.7046, lon: 7.2620, r: 0.4 },
  port:     { lat: 43.6960, lon: 7.2855, r: 0.6 },

  // Nice (ville) : point de départ de la grille
  nice: [[43.7009, 7.2683, 4.5]],

  // Prix fixes depuis Nice, valables dans les deux sens.
  // pts = cercles [latitude, longitude, rayon km]. L'ordre compte : la première zone trouvée l'emporte.
  forfaits: [
    { zone: 'Aéroport',                   special: 'aeroport',                                        berline: 45,  van: 70,  classe_s: 100 },
    { zone: 'Gare Nice Ville',            special: 'gare',                                            berline: 30,  van: 50,  classe_s: 80 },
    { zone: 'Villefranche',               pts: [[43.7040, 7.3115, 1.3]],                              berline: 60,  van: 80,  classe_s: 100 },
    { zone: 'Beaulieu / Cap-Ferrat',      pts: [[43.7075, 7.3325, 1.0], [43.6860, 7.3310, 1.6]],      berline: 70,  van: 90,  classe_s: 130 },
    { zone: 'Èze',                        pts: [[43.7255, 7.3615, 1.8]],                              berline: 90,  van: 110, classe_s: 150 },
    { zone: 'Monaco',                     pts: [[43.7384, 7.4246, 2.5]],                              berline: 110, van: 130, classe_s: 180 },
    { zone: 'Menton',                     pts: [[43.7765, 7.5048, 3.0]],                              berline: 130, van: 150, classe_s: 200 },
    { zone: 'Vintimille',                 pts: [[43.7906, 7.6072, 3.0]],                              berline: 180, van: 230, classe_s: 280 },
    { zone: 'San Remo',                   pts: [[43.8159, 7.7761, 4.0]],                              berline: 230, van: 250, classe_s: 300 },
    { zone: 'Saint-Paul-de-Vence',        pts: [[43.6966, 7.1222, 1.8]],                              berline: 90,  van: 110, classe_s: 130 },
    { zone: 'Antibes / Sophia Antipolis', pts: [[43.5770, 7.1180, 3.5], [43.6163, 7.0552, 3.0]],      berline: 90,  van: 110, classe_s: 150 },
    { zone: 'Cannes',                     pts: [[43.5528, 7.0174, 4.0]],                              berline: 110, van: 130, classe_s: 180 },
    { zone: 'Grasse',                     pts: [[43.6589, 6.9237, 4.0]],                              berline: 130, van: 150, classe_s: 200 },
    { zone: 'Fréjus',                     pts: [[43.4300, 6.7500, 5.0]],                              berline: 300, van: 350, classe_s: 400 },
    { zone: 'Saint-Tropez',               pts: [[43.2650, 6.6450, 4.0]],                              berline: 400, van: 500, classe_s: 700 },
    { zone: 'Marseille',                  pts: [[43.2965, 5.3698, 9.0]],                              berline: 550, van: 650, classe_s: 800 },
    { zone: 'Isola',                      pts: [[44.1866, 7.0510, 2.0], [44.1880, 7.1580, 3.0]],      berline: 280, van: 350, classe_s: 400 },
  ],
};

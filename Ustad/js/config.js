/* ════════════════════════════════════════════
   CONFIGURATION CENTRALISÉE
════════════════════════════════════════════ */

const CFG = {
  // Email de réception
  email_reception: 'reservations@ustad.fr',

  // WhatsApp — numéro international sans espaces ni +
  whatsapp_numero: '33600000000',

  // EmailJS
  emailjs_service_id:   'YOUR_SERVICE_ID',
  emailjs_template_std: 'YOUR_TEMPLATE_STD',
  emailjs_template_ent: 'YOUR_TEMPLATE_ENT',
  emailjs_public_key:   'YOUR_PUBLIC_KEY',
};

// ════ TARIFS ════
const HOTEL = {
  'aeroport': {b:40,v:70,s:100}, 'airport': {b:40,v:70,s:100},
  'gare nice': {b:25,v:40,s:100}, 'monaco': {b:110,v:130,s:150},
  'cannes': {b:110,v:130,s:150}, 'villefranche': {b:60,v:80,s:130},
  'beaulieu': {b:70,v:100,s:150}, 'cap ferrat': {b:70,v:100,s:150},
  'vence': {b:70,v:100,s:150}, 'antibes': {b:90,v:110,s:150},
  'sophia': {b:90,v:110,s:150}, 'eze': {b:80,v:100,s:150},
  'menton': {b:130,v:150,s:180}, 'grasse': {b:130,v:150,s:180},
  'vintimille': {b:170,v:230,s:250}, 'frejus': {b:200,v:250,s:260},
  'san remo': {b:200,v:250,s:300}, 'isola': {b:250,v:300,s:350},
  'st-tropez': {b:350,v:400,s:450}, 'saint-tropez': {b:350,v:400,s:450},
  'marseille': {b:500,v:600,s:700}
};

const KM = {berline:3, van:4, classe_s:4.5};
const HH = {berline:90, van:110, classe_s:115};

// ════ ÉTAT GLOBAL ════
let lang = 'fr';
let tab = 'now';
let cabin = 0;
let large = 0;
let partner = false;
let trips = 0;
let coordCache = {};
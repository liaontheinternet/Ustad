# 🚗 Ustad — Plateforme VTC Premium

Site web pour Ustad, service de chauffeurs privés haut de gamme sur la Côte d'Azur.

**Live:** [À déployer sur Netlify]

---

## 📦 Structure du Projet

```
ustad/
├── index.html                    # HTML unique (SPA)
├── netlify.toml                  # Config Netlify
├── _redirects                    # SPA routing
├── .env.example                  # Variables d'env
├── README.md                     # Ce fichier
│
├── css/                          # Styles modulaires
│   ├── reset.css                # Reset CSS
│   ├── variables.css            # Variables (couleurs, typos)
│   ├── noise.css                # Texture overlay
│   ├── nav.css                  # Navigation
│   ├── hero.css                 # Section hero
│   ├── sections.css             # Sections générales
│   ├── tabs.css                 # Système d'onglets
│   ├── forms.css                # Formulaires
│   ├── autocomplete.css         # Autocomplete
│   ├── confirmation.css         # Écran confirmation
│   ├── app-section.css          # Section application
│   ├── contact-bar.css          # Barre contact
│   ├── driver-section.css       # Section recrutement
│   ├── modals.css               # Modales légales
│   ├── footer.css               # Footer
│   └── responsive.css           # Responsive
│
└── js/                          # Scripts modulaires
    ├── config.js               # Config centralisée
    ├── lang.js                 # Gestion i18n (FR/EN)
    ├── modals.js               # Modales
    ├── driver.js               # Section recrutement
    ├── tabs.js                 # Système tabs
    ├── booking.js              # Calculs prix, validation
    ├─��� autocomplete.js         # Recherche adresses
    ├── forms.js                # Soumission formulaires
    ├── confirmation.js         # Écran confirmation
    └── init.js                 # Initialisation
```

---

## 🚀 Déploiement sur Netlify

### 1. Créer un compte Netlify

→ https://app.netlify.com/signup

### 2. Déployer le site

**Option A : Drag & Drop (plus simple)**

1. Compressez le dossier `ustad/`
2. Allez sur Netlify
3. Glissez-déposez le dossier compressé
4. ✅ Site live en 30 secondes

**Option B : GitHub (recommandé pour maintenance)**

1. Créez un repo GitHub : `ustad-website`
2. Poussez tout le code :
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ustad website"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/ustad-website.git
   git push -u origin main
   ```
3. Connectez le repo à Netlify :
   - Settings → GitHub
   - Selectionnez le repo
   - Build command : `echo 'No build'`
   - Publish directory : `.`
   - ✅ Déployé automatiquement

### 3. Configurer EmailJS (pour les confirmations email)

#### A. Créer les templates

1. Allez sur https://emailjs.com/
2. Créez un compte gratuit
3. Créez un **Service** (ex: "Gmail", "Outlook")
4. Créez **2 templates** :

**Template 1 : Réservation Standard**
- **Template ID** : `template_reservation_std`
- Sujet : `Confirmation de réservation Ustad - {{ref}}`
- Body :
```
Bonjour {{client_name}},

Votre réservation a bien été reçue !

Référence : {{ref}}
Départ : {{depart}}
Destination : {{destination}}
Véhicule : {{vehicule}}
Passagers : {{passagers}}
Estimation : {{estimation}}

Un conseiller Ustad vous contactera sous peu.

Cordialement,
Équipe Ustad
```

**Template 2 : Demande Entreprise**
- **Template ID** : `template_entreprise`
- Sujet : `Demande de devis Ustad - {{ref}}`
- Body :
```
Bonjour {{client_name}},

Votre demande de devis a bien été reçue !

Référence : {{ref}}
Entreprise : {{entreprise}}
Trajets :
{{trajets}}

Vous recevrez un devis détaillé sous 24h ouvrées.

Cordialement,
Équipe Ustad
```

#### B. Récupérer les credentials

1. Dans EmailJS, allez à **Account** → **API Keys**
2. Copiez :
   - **Service ID** (ex: `service_abc123`)
   - **Public Key** (ex: `pub_xyz789`)

#### C. Mettre à jour la config

Dans `js/config.js`, remplacez :

```javascript
const CFG = {
  emailjs_service_id: 'service_abc123',        // votre Service ID
  emailjs_template_std: 'template_reservation_std',
  emailjs_template_ent: 'template_entreprise',
  emailjs_public_key: 'pub_xyz789',            // votre Public Key
};
```

Ou (mieux) : **Mettez les variables dans Netlify Dashboard** :
- Settings → Environment
- Ajoutez :
  ```
  EMAILJS_SERVICE_ID = service_abc123
  EMAILJS_TEMPLATE_STD = template_reservation_std
  EMAILJS_TEMPLATE_ENT = template_entreprise
  EMAILJS_PUBLIC_KEY = pub_xyz789
  ```

---

## 🌐 Multilingue (FR/EN)

Le site supporte le français et l'anglais.

**Comment ça marche :**
- Tous les éléments texte ont `data-fr="..."` et `data-en="..."`
- Le JS les met à jour via `setLang('fr')` ou `setLang('en')`
- Les utilisateurs cliquent sur FR/EN dans le header

**Pour ajouter un texte :**

HTML :
```html
<p data-fr="Texte en français" data-en="Text in English">Texte en français</p>
```

---

## 📝 Formulaires

### Netlify Forms

Tous les formulaires sont automatiquement gérés par Netlify :
- Les données sont envoyées à votre dashboard Netlify
- Vous recevez des notifications par email

**Pas besoin de backend !** ✅

### EmailJS

Les confirmations clients sont envoyées via EmailJS (200 mails/mois gratuit).

---

## 🎨 Personnalisation

### Couleurs

Modifiez `css/variables.css` :

```css
:root {
  --red: #8B1A1A;          /* Accent principal */
  --beige: #E8E0D4;        /* Texte secondaire */
  --white: #F5F0E8;        /* Texte principal */
  /* ... */
}
```

### Tarifs

Modifiez `js/config.js` :

```javascript
const TARIFS_KM = {
  berline: 3,              /* €/km */
  van: 4,
  classe_s: 4.5,
};

const TARIFS_HEURE = {
  berline: 90,             /* €/h */
  van: 110,
  classe_s: 115,
};
```

### Lieux d'autocomplete

Modifiez `js/config.js` → `LOCAL_PLACES[]` :

```javascript
const LOCAL_PLACES = [
  'Nice Centre, Nice',
  'Monaco, Monaco',
  // ... ajoutez vos lieux
];
```

### Numéro WhatsApp

Dans `js/config.js` :

```javascript
CFG.whatsapp_numero = '33612345678';  // sans + ni espaces
```

---

## 🔧 Maintenance

### Ajouter une page

1. Créez une nouvelle `<section>` dans `index.html`
2. Créez un CSS spécifique dans `css/nom-page.css`
3. Créez un JS spécifique dans `js/nom-page.js`
4. Importez-les dans `index.html`

### Modifier le design

**CSS :**
- Chaque composant a son fichier CSS
- Modifiez `css/variables.css` pour les changements globaux

**JS :**
- Chaque feature a son fichier JS
- Tous les fichiers sont chargés dans `index.html`
- **Ordre critique** : `config.js` doit être en premier

### Déboguer

1. Ouvrez la console : `F12` → **Console**
2. Vérifiez les erreurs
3. Vérifiez que `APP_STATE` est accessible
4. Utilisez les DevTools pour inspecter les éléments

---

## 📊 Analytics & Monitoring

### Netlify Analytics (optionnel)

- Settings → Analytics
- Activez pour suivre les visiteurs

### Email notifications

Netlify vous envoie les soumissions de formulaires par email.

Pour activer :
- Settings → Form notifications
- Ajoutez votre email

---

## 🔐 Sécurité

### Points clés

✅ **HTTPS automatique** (Netlify)
✅ **No backend** (donc moins de vulnérabilités)
✅ **Formulaires validés côté client** + Netlify
✅ **EmailJS chiffré** (API secure)
✅ **RGPD compliant** (données non stockées)

### À configurer

1. **DNS** : Pointez votre domaine vers Netlify
2. **SSL** : Auto-renouvelé (gratuit)
3. **Headers de sécurité** : Déjà dans `netlify.toml`

---

## 🚨 Troubleshooting

### "Les emails ne s'envoient pas"

→ Vérifiez que EmailJS est configuré dans `js/config.js` (pas `YOUR_PUBLIC_KEY`)

### "Les formulaires ne s'enregistrent pas"

→ Vérifiez que `netlify.toml` est présent à la racine

### "Les langues ne changent pas"

→ Vérifiez que `setLang('fr')` est appelé dans `js/init.js`

### "Autocomplete ne marche pas"

→ Nominatim peut être lent. Attendez 3-4s pour les résultats en ligne.

---

## 📞 Support

**Pour Netlify :** https://support.netlify.com
**Pour EmailJS :** https://emailjs.com/docs/
**Pour des questions sur le code :** Consultez les commentaires dans les fichiers

---

## 📄 Licence

Propriété exclusive d'Ustad SAS © 2025

---

## 🎯 Checklist avant le lancement

- [ ] Domaine configuré sur Netlify
- [ ] EmailJS credentials dans `js/config.js`
- [ ] Mentions légales complétées (dans les modales)
- [ ] Téléphone & email à jour dans `js/config.js`
- [ ] WhatsApp numero configuré
- [ ] Tarifs vérifiés dans `js/config.js`
- [ ] Lieux autocomplete personnalisés
- [ ] Test sur mobile (F12 → Device toggle)
- [ ] Test des formulaires
- [ ] Test des emails de confirmation
- [ ] Test de la langue (FR/EN)

---

**Projet créé le :** Février 2025
**Dernière mise à jour :** Février 2025
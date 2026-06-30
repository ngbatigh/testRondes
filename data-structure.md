# Structure des Données du Projet testRondes

Ce document décrit l'ensemble des données persistées dans le `localStorage` et les variables globales utilisées dans l'application.

---

## Table des matières

1. [Données localStorage](#1-données-localstorage)
2. [Variables globales (scripts.js)](#2-variables-globalesscriptsjs)
3. [Points d'attention](#3-points-dattention)

---

## 1. Données localStorage

### 1.1 `sections` — Sections/Zones de l'usine

| Propriété | Vale---|--------|
| **Type** | `Array<string>` |
| **Défaut** | 9 sections prédéfinies |

```json
[
  "Salle Des Machines",
  "Embouteillage",
  "Cave-Filtration-Siroperie",
  "Brassage",
  "Administration",
  "Bloc Social",
  "Traitement Eau Process",
  "Traitement Eau Usees",
  "Centre Logistique"
]
```

---

### 1.2 `famille_list` — Types de mesures

| Propriété  | Valeur                 |
| ---------- | ---------------------- |
| **Type**   | `Array<string>`        |
| **Défaut** | 7 familles prédéfinies |

```json
["Eau", "Energie", "DDO", "Vapeur", "Pression", "Temperature", "Debit"]
```

---

### 1.3 `groupe1_list` — Classification primaire

| Propriété  | Valeur          |
| ---------- | --------------- |
| **Type**   | `Array<string>` |
| **Défaut** | Lettres A à I   |

```json
["A", "B", "C", "D", "E", "F", "G", "H", "I"]
```

---

### 1.4 `groupe2_list` — Classification secondaire

| Propriété  | Valeur          |
| ---------- | --------------- |
| **Type**   | `Array<string>` |
| **Défaut** | Chiffres 1 à 9  |

```json
["1", "2", "3", "4", "5", "6", "7", "8", "9"]
```

---

### 1.5 `type_ronde` — Types de rondes

| Propriété  | Valeur             |
| ---------- | ------------------ |
| **Type**   | `Array<TypeRonde>` |
| **Défaut** | 2 types prédéfinis |

```json
[
  {
    "id_ronde": 0,
    "ronde": "Relevé journalier",
    "delai": "1440",
    "description_ronde": "relevé de tous les compteurs chaque matin aux alentours de 06:00"
  },
  {
    "id_ronde": 1,
    "ronde": "Relevé de quart",
    "delai": "480",
    "description_ronde": "relevé de tous les compteurs chaque quart de 8 heures"
  }
]
```

**Interface TypeScript :**

```typescript
interface TypeRonde {
  id_ronde: number;
  ronde: string;
  delai: string; // en minutes
  description_ronde: string;
}
```

---

### 1.6 `tabOperateurs` — Opérateurs

| Propriété  | Valeur                  |
| ---------- | ----------------------- |
| **Type**   | `Array<Operateur>`      |
| **Défaut** | 3 opérateurs prédéfinis |

```json
[
  {
    "id_operateur": "966",
    "nom_operateur": "NADJOMBE",
    "prenom_operateur": "Gbati",
    "fonction_operateur": "admin",
    "nomuser_operateur": "gbati@nadjombe",
    "motdepasse_operateur": "admin"
  },
  {
    "id_operateur": "877",
    "nom_operateur": "KPAKPA",
    "prenom_operateur": "Tam",
    "fonction_operateur": "operateur",
    "nomuser_operateur": "tam@kpakpa",
    "motdepasse_operateur": "123456"
  },
  {
    "id_operateur": "935",
    "nom_operateur": "TSOGBE",
    "prenom_operateur": "Alain",
    "fonction_operateur": "operateur",
    "nomuser_operateur": "alain@tsogbe",
    "motdepasse_operateur": "123456"
  }
]
```

**Interface TypeScript :**

```typescript
interface Operateur {
  id_operateur: string; // Matricule
  nom_operateur: string;
  prenom_operateur: string;
  fonction_operateur: string; // "admin", "operateur", "chef service", "superviseur"
  nomuser_operateur: string;
  motdepasse_operateur: string;
}
```

---

### 1.7 `tabCompteurs` — Compteurs

| Propriété  | Valeur                                                       |
| ---------- | ------------------------------------------------------------ |
| **Type**   | `Array<Compteur>`                                            |
| **Défaut** | 9 compteurs prédéfinis (3 Eau, 3 Électricité, 3 Température) |

```json
[
  {
    "id_compteur": "A-0000-0000-0000-0001",
    "nom_compteur": "eau mitige laveuse",
    "unite_compteur": "m3",
    "debut_compteur": 7.0,
    "range_compteur": 1000000.0,
    "section_compteur": "Embouteillage",
    "famille_compteur": "Eau",
    "groupe1_compteur": "A",
    "groupe2_compteur": "1",
    "enservice_compteur": "2026-06-01 00:00:00",
    "visible_compteur": true,
    "actif_compteur": true,
    "description_compteur": "compteur eau"
  }
]
```

**Interface TypeScript :**

```typescript
interface Compteur {
  id_compteur: string; // Format: X-XXXX-XXXX-XXXX-XXXX
  nom_compteur: string;
  unite_compteur: string; // "m3", "kwh", "°C", etc.
  debut_compteur: number;
  range_compteur: number;
  section_compteur: string;
  famille_compteur: string;
  groupe1_compteur: string;
  groupe2_compteur: string;
  enservice_compteur: string; // Date format "YYYY-MM-DD HH:MM:SS" ou ""
  visible_compteur: boolean;
  actif_compteur: boolean;
  description_compteur: string;
}
```

---

### 1.8 `rondeDB` — Base des relevés

| Propriété  | Valeur                     |
| ---------- | -------------------------- |
| **Type**   | `Object<string, Releve[]>` |
| **Défaut** | `{}` (vide)                |

Clé = `id_compteur`, Valeur = tableau des relevés pour ce compteur.

```json
{
  "A-0000-0000-0000-0001": [
    {
      "id_ronde": 0,
      "id_operateur": "966",
      "id_compteur": "A-0000-0000-0000-0001",
      "valeur": 123.45,
      "date": "2026-06-29",
      "heure": "15:30",
      "commentaire": ""
    }
  ]
}
```

**Interface TypeScript :**

```typescript
interface Releve {
  id_ronde: number;
  id_operateur: string;
  id_compteur: string;
  valeur: number;
  date: string; // Format: "YYYY-MM-DD"
  heure: string; // Format: "HH:MM"
  commentaire: string;
}

interface RondeDB {
  [idCompteur: string]: Releve[];
}
```

---

## 2. Variables globales (scripts.js)

### 2.1 Données persistées (chargées depuis localStorage)

| Variable        | Type               | Source localStorage | Description               |
| --------------- | ------------------ | ------------------- | ------------------------- |
| `sections`      | `Array<string>`    | `sections`          | Liste des sections        |
| `famille_list`  | `Array<string>`    | `famille_list`      | Liste des familles        |
| `groupe1_list`  | `Array<string>`    | `groupe1_list`      | Classification primaire   |
| `groupe2_list`  | `Array<string>`    | `groupe2_list`      | Classification secondaire |
| `type_ronde`    | `Array<TypeRonde>` | `type_ronde`        | Types de rondes           |
| `tabOperateurs` | `Array<Operateur>` | `tabOperateurs`     | Liste des opérateurs      |
| `tabCompteurs`  | `Array<Compteur>`  | `tabCompteurs`      | Liste des compteurs       |
| `rondeDB`       | `RondeDB`          | `rondeDB`           | Base des relevés          |

### 2.2 Variables de session (volatile, non persistées)

| Variable       | Type                   | Description                       |
| -------------- | ---------------------- | --------------------------------- |
| `varSession`   | `Object`               | Session courante                  |
| `relevSession` | `Array<ReleveSession>` | Relevés de la session courante    |
| `recapData`    | `Object`               | Données du récapitulatif en cours |

**Structure de `varSession` :**

```javascript
{
  session: null,           // "ronde" ou "revue"
  "id-operateur": null,    // ID de l'opérateur connecté
  "id-type-ronde": null,   // Type de ronde sélectionné
  "id-compteur": null,     // Compteur scanné/sélectionné
  "date-releve": null,     // Date du relevé (YYYY-MM-DD)
  "heure-releve": null     // Heure du relevé (HH:MM)
}
```

**Structure de `relevSession` (éléments ajoutés) :**

```javascript
{
  id_ronde: number,
  id_operateur: string,
  id_compteur: string,
  valeur: number,
  date: string,           // YYYY-MM-DD
  heure: string,          // HH:MM
  dateDisplay: string,    // Format français
  heureDisplay: string,   // Format français
  operateurNom: string,   // Nom complet
  rondeNom: string,       // Nom de la ronde
  compteurDisplay: string // Affichage compteur
}
```

### 2.3 Variables d'état scanner

| Variable            | Type        | Description                                 |
| ------------------- | ----------- | ------------------------------------------- |
| `qrScanner`         | `QrScanner` | Instance du scanner QR (bibliothèque nimiq) |
| `currentScanResult` | `boolean`   | Résultat du dernier scan (true/false)       |
| `detectedId`        | `string`    | ID détecté par le scanner                   |

### 2.4 Valeurs par défaut (constantes)

Ces constantes sont utilisées pour l'initialisation de la base de données.

| Variable           | Type            | Description         |
| ------------------ | --------------- | ------------------- |
| `sections_default` | `Array<string>` | Sections par défaut |
| `famille_default`  | `Array<string>` | Familles par défaut |
| `groupe1_default`  | `Array<string>` | Groupe 1 par défaut |
| `groupe2_default`  | `Array<string>` | Groupe 2 par défaut |

---

## 3. Points d'attention

### 3.1 Sécurité

- **⚠️ Les mots de passe opérateurs sont stockés en clair** dans le localStorage (`motdepasse_operateur`)
- Aucun hachage ni chiffrement n'est appliqué
- Recommandation : Implémenter un système d'authentification sécurisé (bcrypt, JWT, etc.)

### 3.2 Persistance

- Seul `localStorage` est utilisé (pas de `sessionStorage` pour les données métier)
- `sessionStorage` est uniquement effacé lors du reset complet
- Les données survivent à la fermeture du navigateur

### 3.3 Initialisation

La fonction `loadSavedData()` vérifie la présence de 4 clés pour décider entre :

- **Chargement** : Si `sections`, `type_ronde`, `tabCompteurs` et `rondeDB` existent
- **Initialisation** : Sinon, appelle `initDatabase()` qui crée les valeurs par défaut

### 3.4 Hoisting

La variable `recapData` est déclarée avec `let` à la ligne 1022, après la fonction `handleSubmit` qui l'utilise. Grâce au hoisting des déclarations `let` (TDZ), cela fonctionne mais peut prêter à confusion.

### 3.5 Réinitialisation

Le reset (via le lien "Reset" en bas de page) effectue :

1. `localStorage.clear()` — Supprime toutes les données
2. `sessionStorage.clear()` — Supprime la session
3. `location.reload()` — Recharge l'application

### 3.6 Synchronisation

Toutes les opérations CRUD mettent à jour :

1. La variable globale en mémoire
2. Le localStorage correspondant

Exemple :

```javascript
tabOperateurs.push(nouvelOperateur);
localStorage.setItem("tabOperateurs", JSON.stringify(tabOperateurs));
```

---

## Annexe : Résumé des clés localStorage

| #   | Clé             | Type       | Défaut       |
| --- | --------------- | ---------- | ------------ |
| 1   | `sections`      | `string[]` | 9 sections   |
| 2   | `famille_list`  | `string[]` | 7 familles   |
| 3   | `groupe1_list`  | `string[]` | A-I          |
| 4   | `groupe2_list`  | `string[]` | 1-9          |
| 5   | `type_ronde`    | `object[]` | 2 types      |
| 6   | `tabOperateurs` | `object[]` | 3 opérateurs |
| 7   | `tabCompteurs`  | `object[]` | 9 compteurs  |
| 8   | `rondeDB`       | `object`   | `{}` (vide)  |

---

_Dernière mise à jour : 2026-06-29_

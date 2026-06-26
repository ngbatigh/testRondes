// ============================================================
// DONNÉES
// ============================================================

// Base de données des relevés
let rondeDB = {};

// Types de rondes
let type_ronde = [
  {
    id_ronde: 0,
    ronde: "Relevé journalier",
    delai: "1440",
    description_ronde:
      "relevé de tous les compteurs chaque matin aux alentours de 06:00",
  },
  {
    id_ronde: 1,
    ronde: "Relevé de quart",
    delai: "480",
    description_ronde: "relevé de tous les compteurs chaque quart de 8 heures",
  },
];

// Opérateurs
let tabOperateurs = [];

// Valeurs par défaut des constantes (pour premier lancement)
const sections_default = [
  "Salle Des Machines",
  "Embouteillage",
  "Cave-Filtration-Siroperie",
  "Brassage",
  "Administration",
  "Bloc Social",
  "Traitement Eau Process",
  "Traitement Eau Usees",
  "Centre Logistique",
];
const famille_default = [
  "Eau",
  "Energie",
  "DDO",
  "Vapeur",
  "Pression",
  "Temperature",
  "Debit",
];
const groupe1_default = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const groupe2_default = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Variables chargées depuis localStorage (ou valeurs par défaut)
let sections = [];
let famille_list = [];
let groupe1_list = [];
let groupe2_list = [];

// Tableau des compteurs (9 initialisés depuis le SQL)
let tabCompteurs = [
  // === EAU ===
  {
    id_compteur: "A-0000-0000-0000-0001",
    nom_compteur: "eau mitige laveuse",
    unite_compteur: "m3",
    debut_compteur: 7.0,
    range_compteur: 1000000.0,
    section_compteur: "Embouteillage",
    famille_compteur: "Eau",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "2026-06-01 00:00:00",
    visible_compteur: true,
    actif_compteur: true,
    description_compteur: "compteur eau",
  },
  {
    id_compteur: "B-0000-0000-0000-0001",
    nom_compteur: "eau mitige laveuse",
    unite_compteur: "m3",
    debut_compteur: 7.0,
    range_compteur: 1000000.0,
    section_compteur: "Embouteillage",
    famille_compteur: "Eau",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "compteur eau",
  },
  {
    id_compteur: "C-0000-0000-0000-0001",
    nom_compteur: "eau mitige laveuse",
    unite_compteur: "m3",
    debut_compteur: 7.0,
    range_compteur: 1000000.0,
    section_compteur: "Embouteillage",
    famille_compteur: "Eau",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "compteur eau",
  },
  // === ÉLECTRICITÉ ===
  {
    id_compteur: "A-0000-0000-0000-0010",
    nom_compteur: "electricite Axima",
    unite_compteur: "kwh",
    debut_compteur: 12.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Energie",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "2026-06-20 00:00:00",
    visible_compteur: true,
    actif_compteur: true,
    description_compteur: "compteur d'électricité",
  },
  {
    id_compteur: "B-0000-0000-0000-0010",
    nom_compteur: "electricite Axima",
    unite_compteur: "kwh",
    debut_compteur: 12.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Energie",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "compteur d'électricité",
  },
  {
    id_compteur: "C-0000-0000-0000-0010",
    nom_compteur: "electricite Axima",
    unite_compteur: "kwh",
    debut_compteur: 12.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Energie",
    groupe1_compteur: "A",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "compteur d'électricité",
  },
  // === TEMPÉRATURE ===
  {
    id_compteur: "A-0000-0000-0000-0011",
    nom_compteur: "temperature glycole",
    unite_compteur: "°C",
    debut_compteur: -4.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Temperature",
    groupe1_compteur: "F",
    groupe2_compteur: "1",
    enservice_compteur: "2026-06-19 00:00:00",
    visible_compteur: true,
    actif_compteur: true,
    description_compteur: "Thermometre ligne glycole",
  },
  {
    id_compteur: "B-0000-0000-0000-0011",
    nom_compteur: "temperature glycole",
    unite_compteur: "°C",
    debut_compteur: -4.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Temperature",
    groupe1_compteur: "F",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "Thermometre ligne glycole",
  },
  {
    id_compteur: "C-0000-0000-0000-0011",
    nom_compteur: "temperature glycole",
    unite_compteur: "°C",
    debut_compteur: -4.0,
    range_compteur: 1000000.0,
    section_compteur: "Salle Des Machines",
    famille_compteur: "Temperature",
    groupe1_compteur: "F",
    groupe2_compteur: "1",
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: false,
    description_compteur: "Thermometre ligne glycole",
  },
];

// ============================================================
// VARIABLE SESSION ET ÉTAT
// ============================================================
let varSession = {
  session: null, // "ronde" ou "revue"
  "id-operateur": null,
  "id-type-ronde": null,
  "id-compteur": null,
  "date-releve": null,
  "heure-releve": null,
};

let relevSession = [];

// État scanner QrScanner
let qrScanner = null;
let currentScanResult = null; // true ou false
let detectedId = null;

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function fillSelectFromArray(elementId, array, emptyOption) {
  const select = document.getElementById(elementId);
  if (!select) return;
  select.innerHTML = "";
  if (emptyOption) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = emptyOption;
    select.appendChild(opt);
  }
  array.forEach((val) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function showMessage(message, type = "success") {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
    messageDiv.className = "message";
  }, 3000);
}

function showLoginMessage(message, type = "success") {
  const msgDiv = document.getElementById("loginMessage");
  msgDiv.textContent = message;
  msgDiv.className = `message ${type}`;
  msgDiv.style.display = "block";

  setTimeout(() => {
    msgDiv.style.display = "none";
    msgDiv.className = "message";
  }, 3000);
}

// ============================================================
// GESTION DES OPÉRATEURS
// ============================================================

function remplirOperateursSelect() {
  const selectOperateur = document.getElementById("operateur");
  const selectModif = document.getElementById("selectOperateurModif");

  const defaultOption = '<option value="">Sélectionner un opérateur</option>';

  if (selectOperateur) selectOperateur.innerHTML = defaultOption;
  if (selectModif)
    selectModif.innerHTML = '<option value="">Sélectionner...</option>';

  tabOperateurs.forEach((op) => {
    const text = `${op.prenom_operateur} ${op.nom_operateur}`;

    if (selectOperateur) {
      const option1 = document.createElement("option");
      option1.value = op.id_operateur;
      option1.textContent = text;
      selectOperateur.appendChild(option1);
    }

    if (selectModif) {
      const option2 = document.createElement("option");
      option2.value = op.id_operateur;
      option2.textContent = text;
      selectModif.appendChild(option2);
    }
  });
}

function ajouterOperateur() {
  const idInput = document.getElementById("nouvelOperateurId");
  const nomInput = document.getElementById("nouvelOperateurNom");
  const prenomInput = document.getElementById("nouvelOperateurPrenom");
  const fonctionInput = document.getElementById("nouvelOperateurFonction");
  const userInput = document.getElementById("nouvelOperateurUser");
  const mdpInput = document.getElementById("nouvelOperateurMdp");

  const id = idInput.value.trim();
  const nom = nomInput.value.trim().toUpperCase();
  const prenom = prenomInput.value.trim();
  const fonction = fonctionInput.value.trim();
  const user = userInput.value.trim();
  const mdp = mdpInput.value.trim();

  if (!id || !nom || !prenom) {
    showMessage(
      "Veuillez remplir au moins le matricule, le nom et le prénom",
      "error",
    );
    return;
  }

  if (tabOperateurs.some((op) => op.id_operateur === id)) {
    showMessage(`L'ID "${id}" existe déjà.`, "error");
    return;
  }

  tabOperateurs.push({
    id_operateur: id,
    nom_operateur: nom,
    prenom_operateur: prenom,
    fonction_operateur: fonction,
    nomuser_operateur: user,
    motdepasse_operateur: mdp,
  });

  localStorage.setItem("tabOperateurs", JSON.stringify(tabOperateurs));
  remplirOperateursSelect();

  idInput.value = "";
  nomInput.value = "";
  prenomInput.value = "";
  fonctionInput.value = "";
  userInput.value = "";
  mdpInput.value = "";

  showMessage(`Opérateur ajouté avec succès !`);
}

function handleSelectOperateurModif() {
  const select = document.getElementById("selectOperateurModif");
  const formModif = document.getElementById("formModifierOperateur");
  const idToEdit = select.value;

  if (!idToEdit) {
    formModif.style.display = "none";
    return;
  }

  const operateur = tabOperateurs.find((op) => op.id_operateur === idToEdit);
  if (!operateur) return;

  document.getElementById("ancienOperateurId").value = operateur.id_operateur;
  document.getElementById("modifOperateurId").value = operateur.id_operateur;
  document.getElementById("modifOperateurNom").value = operateur.nom_operateur;
  document.getElementById("modifOperateurPrenom").value =
    operateur.prenom_operateur;
  document.getElementById("modifOperateurFonction").value =
    operateur.fonction_operateur;
  document.getElementById("modifOperateurUser").value =
    operateur.nomuser_operateur;
  document.getElementById("modifOperateurMdp").value =
    operateur.motdepasse_operateur;

  formModif.style.display = "block";
}

function modifierOperateur() {
  const ancienId = document.getElementById("ancienOperateurId").value;
  const idInput = document.getElementById("modifOperateurId");
  const nomInput = document.getElementById("modifOperateurNom");
  const prenomInput = document.getElementById("modifOperateurPrenom");
  const fonctionInput = document.getElementById("modifOperateurFonction");
  const userInput = document.getElementById("modifOperateurUser");
  const mdpInput = document.getElementById("modifOperateurMdp");

  const nouvelId = idInput.value.trim();
  const nom = nomInput.value.trim().toUpperCase();
  const prenom = prenomInput.value.trim();
  const fonction = fonctionInput.value.trim();
  const user = userInput.value.trim();
  const mdp = mdpInput.value.trim();

  if (!nouvelId || !nom || !prenom) {
    showMessage(
      "Veuillez remplir au moins le matricule, le nom et le prénom",
      "error",
    );
    return;
  }

  if (
    nouvelId !== ancienId &&
    tabOperateurs.some((op) => op.id_operateur === nouvelId)
  ) {
    showMessage(`L'ID "${nouvelId}" existe déjà.`, "error");
    return;
  }

  const index = tabOperateurs.findIndex((op) => op.id_operateur === ancienId);
  if (index !== -1) {
    tabOperateurs[index] = {
      id_operateur: nouvelId,
      nom_operateur: nom,
      prenom_operateur: prenom,
      fonction_operateur: fonction,
      nomuser_operateur: user,
      motdepasse_operateur: mdp,
    };

    localStorage.setItem("tabOperateurs", JSON.stringify(tabOperateurs));
    remplirOperateursSelect();

    document.getElementById("selectOperateurModif").value = nouvelId;
    document.getElementById("ancienOperateurId").value = nouvelId;

    showMessage(`Opérateur modifié avec succès !`);
  }
}

function renderOperateursCheckList() {
  const container = document.getElementById("operateursCheckList");
  if (!container) return;
  container.innerHTML = "";

  if (tabOperateurs.length === 0) {
    container.innerHTML =
      '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Aucun opérateur à supprimer.</p>';
    return;
  }

  tabOperateurs.forEach((op) => {
    const div = document.createElement("div");
    div.className = "check-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check-op-${op.id_operateur}`;
    checkbox.value = op.id_operateur;

    const label = document.createElement("label");
    label.htmlFor = `check-op-${op.id_operateur}`;
    label.innerHTML = `<strong>${op.id_operateur}</strong> - ${op.prenom_operateur} ${op.nom_operateur} <small>(${op.fonction_operateur})</small>`;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function supprimerOperateursSelection() {
  const checkboxes = document.querySelectorAll(
    "#operateursCheckList input[type='checkbox']:checked",
  );

  if (checkboxes.length === 0) {
    showMessage("Veuillez sélectionner au moins un opérateur", "error");
    return;
  }

  const idsToDelete = [];
  checkboxes.forEach((cb) => idsToDelete.push(cb.value));

  const noms = tabOperateurs
    .filter((op) => idsToDelete.includes(op.id_operateur))
    .map((op) => `${op.prenom_operateur} ${op.nom_operateur}`);

  if (!confirm(`Supprimer ${noms.length} opérateur(s) :\n${noms.join(", ")} ?`))
    return;

  tabOperateurs = tabOperateurs.filter(
    (op) => !idsToDelete.includes(op.id_operateur),
  );

  localStorage.setItem("tabOperateurs", JSON.stringify(tabOperateurs));
  renderOperateursCheckList();
  remplirOperateursSelect();

  const selectModifId = document.getElementById("selectOperateurModif")?.value;
  if (selectModifId && idsToDelete.includes(selectModifId)) {
    const formModif = document.getElementById("formModifierOperateur");
    if (formModif) formModif.style.display = "none";
  }

  showMessage(`${noms.length} opérateur(s) supprimé(s).`);
}

function setupGestionOperateurs() {
  document
    .getElementById("goToAjouterOperateur")
    ?.addEventListener("click", () => showPanel("ajouterOperateurPanel"));
  document
    .getElementById("goToModifierOperateur")
    ?.addEventListener("click", () => {
      showPanel("modifierOperateurPanel");
      const formModif = document.getElementById("formModifierOperateur");
      if (formModif) formModif.style.display = "none";
      const sel = document.getElementById("selectOperateurModif");
      if (sel) sel.value = "";
    });
  document
    .getElementById("goToSupprimerOperateur")
    ?.addEventListener("click", () => showPanel("supprimerOperateurPanel"));

  document
    .getElementById("backFromOperateursMenu")
    ?.addEventListener("click", () => showPanel("releveForm"));
  document
    .getElementById("backFromAjouterOperateur")
    ?.addEventListener("click", () => showPanel("gestionOperateursMenu"));
  document
    .getElementById("backFromModifierOperateur")
    ?.addEventListener("click", () => showPanel("gestionOperateursMenu"));
  document
    .getElementById("backFromSupprimerOperateur")
    ?.addEventListener("click", () => showPanel("gestionOperateursMenu"));

  document
    .getElementById("annulerAjouterOperateur")
    ?.addEventListener("click", () => showPanel("gestionOperateursMenu"));
  document
    .getElementById("annulerModifierOperateur")
    ?.addEventListener("click", () => showPanel("gestionOperateursMenu"));

  document
    .getElementById("ajouterOperateurBtn")
    ?.addEventListener("click", ajouterOperateur);
  document
    .getElementById("selectOperateurModif")
    ?.addEventListener("change", handleSelectOperateurModif);
  document
    .getElementById("modifierOperateurBtn")
    ?.addEventListener("click", modifierOperateur);
  document
    .getElementById("supprimerOperateursBtn")
    ?.addEventListener("click", supprimerOperateursSelection);
}

// ============================================================
// GESTION DES RELEVÉS
// ============================================================

function initDatabase() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];
  const heureStr = yesterday.toTimeString().split(" ")[0].substring(0, 5);

  sections = [...sections_default];
  famille_list = [...famille_default];
  groupe1_list = [...groupe1_default];
  groupe2_list = [...groupe2_default];
  localStorage.setItem("sections", JSON.stringify(sections));
  localStorage.setItem("famille_list", JSON.stringify(famille_list));
  localStorage.setItem("groupe1_list", JSON.stringify(groupe1_list));
  localStorage.setItem("groupe2_list", JSON.stringify(groupe2_list));

  type_ronde = [
    {
      id_ronde: 0,
      ronde: "Relevé journalier",
      delai: "1440",
      description_ronde: "relevé de tous les compteurs chaque matin",
    },
    {
      id_ronde: 1,
      ronde: "Relevé de quart",
      delai: "480",
      description_ronde: "relevé de tous les compteurs chaque quart",
    },
  ];
  localStorage.setItem("type_ronde", JSON.stringify(type_ronde));

  tabOperateurs = [
    {
      id_operateur: "966",
      nom_operateur: "NADJOMBE",
      prenom_operateur: "Gbati",
      fonction_operateur: "admin",
      nomuser_operateur: "gbati@nadjombe",
      motdepasse_operateur: "admin",
    },
    {
      id_operateur: "877",
      nom_operateur: "KPAKPA",
      prenom_operateur: "Tam",
      fonction_operateur: "operateur",
      nomuser_operateur: "tam@kpakpa",
      motdepasse_operateur: "123456",
    },
    {
      id_operateur: "935",
      nom_operateur: "TSOGBE",
      prenom_operateur: "Alain",
      fonction_operateur: "operateur",
      nomuser_operateur: "alain@tsogbe",
      motdepasse_operateur: "123456",
    },
  ];
  localStorage.setItem("tabOperateurs", JSON.stringify(tabOperateurs));

  localStorage.setItem("tabCompteurs", JSON.stringify(tabCompteurs));

  rondeDB = {};
  localStorage.setItem("rondeDB", JSON.stringify(rondeDB));
}

function fillRondeSelect() {
  const select = document.getElementById("id_ronde");
  if (!select) return;
  select.innerHTML = '<option value="">Sélectionner une ronde</option>';
  type_ronde.forEach((r) => {
    const option = document.createElement("option");
    option.value = r.id_ronde;
    option.textContent = r.ronde;
    select.appendChild(option);
  });
}

function fillChoixTypeRondeSelect() {
  const select = document.getElementById("choixTypeRonde");
  if (!select) return;
  select.innerHTML = '<option value="">Sélectionner un type de ronde</option>';
  type_ronde.forEach((r) => {
    const option = document.createElement("option");
    option.value = r.id_ronde;
    option.textContent = r.ronde;
    select.appendChild(option);
  });
}

function fillCompteurSelect() {
  const select = document.getElementById("compteur");
  if (!select) return;
  select.innerHTML = '<option value="">Sélectionner un compteur</option>';
  tabCompteurs
    .filter((c) => c.visible_compteur && c.actif_compteur)
    .forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id_compteur;
      option.textContent = `${c.id_compteur} — ${c.nom_compteur} (${c.unite_compteur})`;
      select.appendChild(option);
    });
}

function saveReleve(id_ronde, id_operateur, id_compteur, valeur) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const heureStr = now.toTimeString().split(" ")[0].substring(0, 5);

  const newReleve = {
    id_ronde: parseInt(id_ronde),
    id_operateur: id_operateur,
    id_compteur: id_compteur,
    valeur: valeur,
    date: dateStr,
    heure: heureStr,
    commentaire: "",
  };

  if (!rondeDB[id_compteur]) {
    rondeDB[id_compteur] = [];
  }
  rondeDB[id_compteur].push(newReleve);
  localStorage.setItem("rondeDB", JSON.stringify(rondeDB));
}

// ============================================================
// LOGIN / SESSION (tâche 2)
// ============================================================

function handleLogin() {
  const userInput = document.getElementById("loginUser").value.trim();
  const mdpInput = document.getElementById("loginMdp").value.trim();

  if (!userInput || !mdpInput) {
    showLoginMessage(
      "Veuillez saisir votre nom d'utilisateur et mot de passe",
      "error",
    );
    return;
  }

  const operateur = tabOperateurs.find(
    (op) =>
      op.nomuser_operateur === userInput &&
      op.motdepasse_operateur === mdpInput,
  );

  if (!operateur) {
    showLoginMessage("Identifiants incorrects", "error");
    return;
  }

  varSession["id-operateur"] = operateur.id_operateur;

  // Appliquer restrictions admin
  applyAdminRestrictions(operateur);

  document.getElementById("loginPanel").style.display = "none";
  document.getElementById("choixRondePanel").style.display = "block";
  fillChoixTypeRondeSelect();
}

function bypassLogin() {
  if (tabOperateurs.length > 0) {
    varSession["id-operateur"] = tabOperateurs[0].id_operateur;
    applyAdminRestrictions(tabOperateurs[0]);

    document.getElementById("loginPanel").style.display = "none";
    document.getElementById("choixRondePanel").style.display = "block";
    fillChoixTypeRondeSelect();
  } else {
    showLoginMessage("Aucun opérateur disponible", "error");
  }
}

function applyAdminRestrictions(operateur) {
  const fonction = (operateur.fonction_operateur || "").toLowerCase();
  const isAdmin =
    fonction === "admin" ||
    fonction === "chef service" ||
    fonction === "superviseur";

  if (!isAdmin) {
    document.querySelectorAll(".sidebar-menu a").forEach((link) => {
      const action = link.dataset.action;
      if (
        action === "operateurs" ||
        action === "compteurs" ||
        action === "rondes"
      ) {
        link.style.display = "none";
      }
    });
  }
}

// ============================================================
// CHOIX RONDE / REVUE
// ============================================================

function setupChoixRonde() {
  document.querySelectorAll('input[name="choix_ronde"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const typeRondeGroup = document.getElementById("choixTypeRondeGroup");
      if (this.value === "ronde") {
        typeRondeGroup.style.display = "block";
      } else {
        typeRondeGroup.style.display = "none";
      }
    });
  });

  document
    .getElementById("validerChoixRonde")
    .addEventListener("click", function () {
      const choix = document.querySelector(
        'input[name="choix_ronde"]:checked',
      )?.value;

      if (!choix) {
        showMessage("Veuillez choisir un mode", "error");
        return;
      }

      varSession["session"] = choix;

      if (choix === "ronde") {
        const typeRonde = document.getElementById("choixTypeRonde").value;
        if (!typeRonde) {
          showMessage("Veuillez sélectionner un type de ronde", "error");
          return;
        }
        varSession["id-type-ronde"] = parseInt(typeRonde);
        document.getElementById("id_ronde").value = typeRonde;
        document.getElementById("id_ronde").disabled = true;
      } else {
        varSession["id-type-ronde"] = null;
        document.getElementById("id_ronde").disabled = false;
      }

      // Initialiser les dates
      const now = new Date();
      varSession["date-releve"] = now.toISOString().split("T")[0];
      varSession["heure-releve"] = now
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);

      document.getElementById("choixRondePanel").style.display = "none";
      document.getElementById("releveForm").style.display = "block";
      chargerFormulaire();
    });
}

// ============================================================
// FORMULAIRE ADAPTATIF
// ============================================================

function chargerFormulaire() {
  // L'opérateur est toujours verrouillé après login
  document.getElementById("operateur").disabled = true;
  if (varSession["id-operateur"]) {
    document.getElementById("operateur").value = varSession["id-operateur"];
  }

  // Le type de ronde est verrouillé si "ronde" a été choisi
  if (
    varSession["id-type-ronde"] !== null &&
    varSession["id-type-ronde"] !== undefined
  ) {
    document.getElementById("id_ronde").value = varSession["id-type-ronde"];
    document.getElementById("id_ronde").disabled = true;
  } else {
    document.getElementById("id_ronde").disabled = false;
  }

  // Le select compteur est inactif par défaut
  const selectCompteur = document.getElementById("compteur");
  if (varSession["id-compteur"]) {
    // Cas du scan réussi : on s'assure qu'il est dans la liste et on le verrouille
    const compteurTrouve = tabCompteurs.find(
      (c) => c.id_compteur === varSession["id-compteur"],
    );
    if (compteurTrouve) {
      let optionExists = Array.from(selectCompteur.options).some(
        (opt) => opt.value === varSession["id-compteur"],
      );
      if (!optionExists) {
        const opt = document.createElement("option");
        opt.value = varSession["id-compteur"];
        opt.textContent = `${compteurTrouve.id_compteur} — ${compteurTrouve.nom_compteur}`;
        selectCompteur.appendChild(opt);
      }
      selectCompteur.value = varSession["id-compteur"];
      selectCompteur.disabled = true;
    } else {
      fillCompteurSelect();
      selectCompteur.disabled = false;
      varSession["id-compteur"] = null;
    }
  } else {
    // Par défaut ou si aucun scan réussi, il est inactif (verrouillé vide)
    // Sauf si on vient de cliquer sur Annuler et qu'on l'a explicitement activé
    if (selectCompteur.disabled !== false) {
      selectCompteur.value = "";
      selectCompteur.disabled = true;
    }
  }
}

// ============================================================
// SCANNER QR CODE AVEC QR-SCANNER (NIMIQ)
// ============================================================

function ouvrirScanner() {
  document.getElementById("releveForm").style.display = "none";
  document.getElementById("scannerPanel").style.display = "flex";
  demarrerScanner();
}

function demarrerScanner() {
  const statusDiv = document.getElementById("scannerStatus");
  const video = document.getElementById("video");
  const manualBtn = document.getElementById("manualEntryBtn");

  statusDiv.textContent = "Initialisation de la caméra...";
  currentScanResult = null;
  detectedId = null;
  if (manualBtn) manualBtn.style.display = "none";

  // Configuration du chemin du worker
  QrScanner.WORKER_PATH = "lib/qr-scanner-worker.min.js";

  // Initialisation de QrScanner si pas encore fait
  if (!qrScanner) {
    qrScanner = new QrScanner(
      video,
      (result) => handleScanResult(result.data),
      {
        onDecodeError: (error) => {
          // On ignore les erreurs de décodage habituelles (quand aucun QR n'est en vue)
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      },
    );
  }

  qrScanner
    .start()
    .then(() => {
      statusDiv.textContent = "🔍 Pointez le code QR vers la caméra";
    })
    .catch((err) => {
      console.error(err);
      statusDiv.innerHTML = `<span style="color: #ffc107;">⚠️ Caméra inaccessible.<br><small>Vérifiez les permissions et le protocole HTTPS.</small></span>`;
      if (manualBtn) manualBtn.style.display = "inline-block";
    });
}

function handleScanResult(data) {
  const statusDiv = document.getElementById("scannerStatus");
  detectedId = data;
  const compteur = tabCompteurs.find((c) => c.id_compteur === detectedId);

  if (compteur && compteur.visible_compteur && compteur.actif_compteur) {
    statusDiv.innerHTML = `<span style="color: #00ff00;">✅ Compteur détecté : ${compteur.nom_compteur}</span>`;
    currentScanResult = true;
    qrScanner.stop(); // On arrête dès qu'on a un résultat valide
  } else {
    statusDiv.innerHTML = `<span style="color: #ffc107;">⚠️ Compteur non trouvé ou inactif (${detectedId})</span>`;
    currentScanResult = false;
    // On peut choisir de ne pas arrêter le scan ici pour laisser une autre chance,
    // mais le bouton "Continuer" utilisera ce résultat.
  }
}

function stopperScannerLocal() {
  if (qrScanner) {
    qrScanner.stop();
  }
  document.getElementById("scannerPanel").style.display = "none";
}

function actionContinuerScan() {
  stopperScannerLocal();
  if (currentScanResult === true && detectedId) {
    varSession["id-compteur"] = detectedId;
    document.getElementById("compteur").disabled = true;
  } else {
    // Si aucun scan ou scan invalide, la continuation n'active pas forcément,
    // ou on l'active explicitement pour saisie manuelle si le code n'est pas reconnu.
    fillCompteurSelect();
    document.getElementById("compteur").disabled = false;
    varSession["id-compteur"] = null;
  }
  document.getElementById("releveForm").style.display = "block";
  chargerFormulaire();
}

function actionAnnulerScan() {
  stopperScannerLocal();
  // Active le select et charge la liste
  fillCompteurSelect();
  document.getElementById("compteur").disabled = false;
  varSession["id-compteur"] = null;

  document.getElementById("releveForm").style.display = "block";
}

function actionSaisieManuelle() {
  actionAnnulerScan();
}

// ============================================================
// RÉCAPITULATIF
// ============================================================

function handleSubmit(event) {
  event.preventDefault();
  const id_ronde = document.getElementById("id_ronde").value;
  const operateur = document.getElementById("operateur").value;
  const compteur = document.getElementById("compteur").value;
  const valeurActuelle = parseFloat(
    document.getElementById("valeurActuelle").value,
  );

  if (!id_ronde || !operateur || !compteur || isNaN(valeurActuelle)) {
    showMessage("Veuillez remplir tous les champs obligatoires", "error");
    return;
  }

  varSession["id-compteur"] = compteur;
  varSession["id-type-ronde"] = parseInt(id_ronde);
  varSession["id-operateur"] = operateur;

  const op = tabOperateurs.find((o) => o.id_operateur === operateur);
  const rondeObj = type_ronde.find((r) => r.id_ronde === parseInt(id_ronde));
  const compteurObj = tabCompteurs.find((c) => c.id_compteur === compteur);
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR");
  const heureStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("recapOperateur").textContent = op
    ? `${op.prenom_operateur} ${op.nom_operateur}`
    : operateur;
  document.getElementById("recapRonde").textContent = rondeObj
    ? rondeObj.ronde
    : id_ronde;
  document.getElementById("recapCompteur").textContent = compteurObj
    ? `${compteurObj.id_compteur} — ${compteurObj.nom_compteur}`
    : compteur;
  document.getElementById("recapDate").textContent = `${dateStr} à ${heureStr}`;
  document.getElementById("recapValeur").textContent = valeurActuelle;

  recapData = {
    id_ronde: parseInt(id_ronde),
    id_operateur: operateur,
    id_compteur: compteur,
    valeur: valeurActuelle,
  };

  document.getElementById("releveForm").style.display = "none";
  document.getElementById("recapPanel").style.display = "block";
}

let recapData = null;

// ============================================================
// POST-CONFIRMATION
// ============================================================

function confirmerReleve() {
  if (!recapData) return;

  saveReleve(
    recapData.id_ronde,
    recapData.id_operateur,
    recapData.id_compteur,
    recapData.valeur,
  );

  const now = new Date();
  relevSession.push({
    ...recapData,
    date: now.toISOString().split("T")[0],
    heure: now.toTimeString().split(" ")[0].substring(0, 5),
    dateDisplay: now.toLocaleDateString("fr-FR"),
    heureDisplay: now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    operateurNom: document.getElementById("recapOperateur").textContent,
    rondeNom: document.getElementById("recapRonde").textContent,
    compteurDisplay: document.getElementById("recapCompteur").textContent,
  });

  recapData = null;
  document.getElementById("recapPanel").style.display = "none";
  document.getElementById("postConfirmationDialog").style.display = "block";
}

function annulerReleve() {
  recapData = null;
  document.getElementById("recapPanel").style.display = "none";
  document.getElementById("releveForm").style.display = "block";
}

function continuerRonde() {
  document.getElementById("postConfirmationDialog").style.display = "none";
  document.getElementById("releveForm").style.display = "block";
  document.getElementById("valeurActuelle").value = "";

  // Le compteur doit être réinitialisé et inactif pour forcer un nouveau scan
  varSession["id-compteur"] = null;
  document.getElementById("compteur").disabled = true;
  document.getElementById("compteur").value = "";
  chargerFormulaire();
}

function finirRonde() {
  document.getElementById("postConfirmationDialog").style.display = "none";
  afficherFinRonde();
}

// ============================================================
// PANNEAU FIN DE RONDE
// ============================================================

function afficherFinRonde() {
  const sortedReleves = [...relevSession].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.heure.localeCompare(b.heure);
  });

  const container = document.getElementById("finRondeListe");
  container.innerHTML = "";

  if (sortedReleves.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666;">Aucun relevé effectué.</p>';
  } else {
    let html = '<table class="table-releves">';
    html +=
      "<thead><tr><th>N°</th><th>Op.</th><th>Ronde</th><th>Compteur</th><th>Heure</th><th>Val.</th></tr></thead><tbody>";
    sortedReleves.forEach((r, index) => {
      html += `<tr>
        <td>${index + 1}</td>
        <td>${r.operateurNom}</td>
        <td>${r.rondeNom}</td>
        <td>${r.compteurDisplay}</td>
        <td>${r.heureDisplay}</td>
        <td class="valeur-cell">${r.valeur}</td>
      </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  }

  document.getElementById("finRondePanel").style.display = "block";
}

function finRondeFin() {
  if (confirm("Confirmer l'envoi de tous les relevés de la session ?")) {
    const jsonData = JSON.stringify(
      { session: varSession, releves: relevSession },
      null,
      2,
    );
    console.log("📤 POST Backend:", jsonData);
    showMessage(`✅ ${relevSession.length} relevé(s) envoyé(s) avec succès !`);

    setTimeout(() => {
      if (confirm("L'application va être fermée.")) {
        document.getElementById("finRondePanel").style.display = "none";
        reinitialiserApplication();
      }
    }, 500);
  }
}

function finRondeNouvelleSession() {
  if (
    confirm("Confirmer l'envoi des relevés et démarrer une nouvelle session ?")
  ) {
    const jsonData = JSON.stringify(
      { session: varSession, releves: relevSession },
      null,
      2,
    );
    console.log("📤 POST Backend:", jsonData);
    showMessage(
      `✅ ${relevSession.length} relevé(s) envoyé(s) ! Redémarrage...`,
    );

    setTimeout(() => {
      reinitialiserApplication();
    }, 1000);
  }
}

function reinitialiserApplication() {
  varSession = {
    session: null,
    "id-operateur": null,
    "id-type-ronde": null,
    "id-compteur": null,
    "date-releve": null,
    "heure-releve": null,
  };
  relevSession = [];
  recapData = null;

  document.getElementById("operateur").disabled = true;
  document.getElementById("id_ronde").disabled = true;
  document.getElementById("compteur").disabled = true;
  document.getElementById("valeurActuelle").value = "";

  document.getElementById("finRondePanel").style.display = "none";
  document.getElementById("releveForm").style.display = "none";
  document.getElementById("loginPanel").style.display = "block";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginMdp").value = "";

  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.style.display = "block";
  });
}

// ============================================================
// AFFICHAGE DES PANNEAUX
// ============================================================

function showPanel(panelId) {
  const form = document.getElementById("releveForm");

  const operateursMenu = document.getElementById("gestionOperateursMenu");
  const ajouterOperateurPanel = document.getElementById(
    "ajouterOperateurPanel",
  );
  const modifierOperateurPanel = document.getElementById(
    "modifierOperateurPanel",
  );
  const supprimerOperateurPanel = document.getElementById(
    "supprimerOperateurPanel",
  );

  const rondesMenu = document.getElementById("gestionRondesMenu");
  const ajouterRonde = document.getElementById("ajouterRondePanel");
  const supprimerRonde = document.getElementById("supprimerRondePanel");

  const compteursMenu = document.getElementById("gestionCompteursMenu");
  const activerCompteur = document.getElementById("activerCompteurPanel");
  const modifierCompteur = document.getElementById("modifierCompteurPanel");
  const clonerCompteur = document.getElementById("clonerCompteurPanel");
  const creerCompteur = document.getElementById("creerCompteurPanel");
  const qrCodeCompteur = document.getElementById("qrCodeCompteurPanel");

  const allPanels = [
    form,
    operateursMenu,
    ajouterOperateurPanel,
    modifierOperateurPanel,
    supprimerOperateurPanel,
    rondesMenu,
    ajouterRonde,
    supprimerRonde,
    compteursMenu,
    activerCompteur,
    modifierCompteur,
    clonerCompteur,
    creerCompteur,
    qrCodeCompteur,
  ];
  allPanels.forEach((p) => {
    if (p) p.style.display = "none";
  });

  if (panelId === "releveForm") form.style.display = "block";
  else if (panelId === "gestionOperateursMenu") {
    if (operateursMenu) operateursMenu.style.display = "block";
  } else if (panelId === "ajouterOperateurPanel") {
    if (ajouterOperateurPanel) ajouterOperateurPanel.style.display = "block";
  } else if (panelId === "modifierOperateurPanel") {
    if (modifierOperateurPanel) modifierOperateurPanel.style.display = "block";
  } else if (panelId === "supprimerOperateurPanel") {
    if (supprimerOperateurPanel)
      supprimerOperateurPanel.style.display = "block";
    renderOperateursCheckList();
  } else if (panelId === "gestionRondesMenu")
    rondesMenu.style.display = "block";
  else if (panelId === "ajouterRondePanel")
    ajouterRonde.style.display = "block";
  else if (panelId === "supprimerRondePanel") {
    supprimerRonde.style.display = "block";
    renderRondesCheckList();
  } else if (panelId === "gestionCompteursMenu")
    compteursMenu.style.display = "block";
  else if (panelId === "activerCompteurPanel") {
    activerCompteur.style.display = "block";
    renderActiverCheckList();
  } else if (panelId === "modifierCompteurPanel") {
    modifierCompteur.style.display = "block";
    remplirSelectModifier();
  } else if (panelId === "clonerCompteurPanel") {
    clonerCompteur.style.display = "block";
    remplirSelectCloner();
  } else if (panelId === "creerCompteurPanel") {
    creerCompteur.style.display = "block";
  } else if (panelId === "qrCodeCompteurPanel") {
    qrCodeCompteur.style.display = "block";
    const select = document.getElementById("qrSelectCompteur");
    if (select) {
      select.innerHTML = '<option value="">Choisir...</option>';
      tabCompteurs.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id_compteur;
        opt.textContent = `${c.id_compteur} — ${c.nom_compteur}`;
        select.appendChild(opt);
      });
    }
    const container = document.getElementById("qrCodeContainer");
    if (container) container.style.display = "none";
  }
}

// ============================================================
// MENU LATÉRAL
// ============================================================

function setupSidebar() {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }

  menuBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      closeSidebar();

      if (action === "operateurs") showPanel("gestionOperateursMenu");
      else if (action === "rondes") showPanel("gestionRondesMenu");
      else if (action === "compteurs") showPanel("gestionCompteursMenu");
      else {
        showPanel("releveForm");
        if (action === "recap")
          showMessage("📋 Recap ronde - Fonctionnalité à venir");
        else if (action === "dashboard")
          showMessage("📈 Tableau de bord - Fonctionnalité à venir");
        else if (action === "tableur")
          showMessage("📑 Tableur - Fonctionnalité à venir");
      }
    });
  });
}

// ============================================================
// GESTION DES RONDES, COMPTEURS ET AUTRES FONCTIONS CRUD
// ============================================================

function renderRondesCheckList() {
  const container = document.getElementById("rondesCheckList");
  if (!container) return;
  container.innerHTML = "";

  if (type_ronde.length === 0) {
    container.innerHTML =
      '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Aucune ronde à supprimer.</p>';
    return;
  }

  type_ronde.forEach((r) => {
    const div = document.createElement("div");
    div.className = "check-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check-${r.id_ronde}`;
    checkbox.value = r.id_ronde;
    const label = document.createElement("label");
    label.htmlFor = `check-${r.id_ronde}`;
    label.innerHTML = `${r.ronde} <small>(Délai: ${r.delai} min — ${r.description_ronde})</small>`;
    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function ajouterRonde() {
  const nomInput = document.getElementById("nouvelleRondeNom");
  const delaiInput = document.getElementById("nouvelleRondeDelai");
  const descInput = document.getElementById("nouvelleRondeDescription");
  const nom = nomInput?.value?.trim();
  const delai = delaiInput?.value?.trim();
  const description = descInput?.value?.trim();

  if (!nom || !delai) {
    showMessage("Veuillez remplir au moins le nom et le délai", "error");
    return;
  }
  const maxId =
    type_ronde.length > 0 ? Math.max(...type_ronde.map((r) => r.id_ronde)) : -1;
  type_ronde.push({
    id_ronde: maxId + 1,
    ronde: nom,
    delai: delai,
    description_ronde: description || "",
  });
  localStorage.setItem("type_ronde", JSON.stringify(type_ronde));
  fillRondeSelect();
  if (nomInput) nomInput.value = "";
  if (delaiInput) delaiInput.value = "";
  if (descInput) descInput.value = "";
  showMessage(`Ronde "${nom}" ajoutée avec succès !`);
}

function supprimerRondesSelection() {
  const checkboxes = document.querySelectorAll(
    "#rondesCheckList input[type='checkbox']:checked",
  );
  if (checkboxes.length === 0) {
    showMessage("Veuillez sélectionner au moins une ronde", "error");
    return;
  }
  const idsToDelete = [];
  checkboxes.forEach((cb) => idsToDelete.push(parseInt(cb.value)));
  const noms = type_ronde
    .filter((r) => idsToDelete.includes(r.id_ronde))
    .map((r) => r.ronde);
  if (!confirm(`Supprimer ${noms.length} ronde(s) :\n${noms.join(", ")} ?`))
    return;
  type_ronde = type_ronde.filter((r) => !idsToDelete.includes(r.id_ronde));
  localStorage.setItem("type_ronde", JSON.stringify(type_ronde));
  renderRondesCheckList();
  fillRondeSelect();
  showMessage(`${noms.length} ronde(s) supprimée(s).`);
}

function setupGestionRondes() {
  document
    .getElementById("goToAjouterRonde")
    ?.addEventListener("click", () => showPanel("ajouterRondePanel"));
  document
    .getElementById("goToSupprimerRonde")
    ?.addEventListener("click", () => showPanel("supprimerRondePanel"));
  document
    .getElementById("backFromRondesMenu")
    ?.addEventListener("click", () => showPanel("releveForm"));
  document
    .getElementById("backFromAjouter")
    ?.addEventListener("click", () => showPanel("gestionRondesMenu"));
  document
    .getElementById("backFromSupprimer")
    ?.addEventListener("click", () => showPanel("gestionRondesMenu"));
  document
    .getElementById("annulerAjouter")
    ?.addEventListener("click", () => showPanel("gestionRondesMenu"));
  document
    .getElementById("ajouterRondeBtn")
    ?.addEventListener("click", ajouterRonde);
  document
    .getElementById("supprimerRondesBtn")
    ?.addEventListener("click", supprimerRondesSelection);
}

function renderActiverCheckList() {
  const container = document.getElementById("activerCheckList");
  if (!container) return;
  container.innerHTML = "";
  if (tabCompteurs.length === 0) {
    container.innerHTML =
      '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Aucun compteur.</p>';
    return;
  }
  tabCompteurs.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "check-item";
    div.style.flexDirection = "column";
    div.style.alignItems = "stretch";
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "8px";
    const info = document.createElement("span");
    info.style.fontWeight = "600";
    info.textContent = `${c.id_compteur} — ${c.nom_compteur}`;
    header.appendChild(info);
    const badge = document.createElement("span");
    badge.style.fontSize = "12px";
    badge.style.padding = "2px 8px";
    badge.style.borderRadius = "4px";
    badge.style.fontWeight = "600";
    if (c.actif_compteur && c.visible_compteur) {
      badge.style.background = "#d4edda";
      badge.style.color = "#155724";
      badge.textContent = "✅ Actif & visible";
    } else if (c.actif_compteur) {
      badge.style.background = "#fff3cd";
      badge.style.color = "#856404";
      badge.textContent = "👁️ Actif mais invisible";
    } else {
      badge.style.background = "#f8d7da";
      badge.style.color = "#721c24";
      badge.textContent = "⏸️ Inactif";
    }
    header.appendChild(badge);
    div.appendChild(header);
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "20px";
    const cbVisible = document.createElement("label");
    cbVisible.style.cursor = "pointer";
    cbVisible.style.fontWeight = "500";
    const inputVisible = document.createElement("input");
    inputVisible.type = "checkbox";
    inputVisible.checked = c.visible_compteur;
    inputVisible.dataset.index = index;
    inputVisible.dataset.field = "visible_compteur";
    cbVisible.appendChild(inputVisible);
    cbVisible.appendChild(document.createTextNode(" 👁️ Visible"));
    const cbActif = document.createElement("label");
    cbActif.style.cursor = "pointer";
    cbActif.style.fontWeight = "500";
    const inputActif = document.createElement("input");
    inputActif.type = "checkbox";
    inputActif.checked = c.actif_compteur;
    inputActif.dataset.index = index;
    inputActif.dataset.field = "actif_compteur";
    cbActif.appendChild(inputActif);
    cbActif.appendChild(document.createTextNode(" ✅ Actif"));
    row.appendChild(cbVisible);
    row.appendChild(cbActif);
    div.appendChild(row);
    container.appendChild(div);
  });
}

function enregistrerActiver() {
  const checkboxes = document.querySelectorAll(
    "#activerCheckList input[type='checkbox']",
  );
  checkboxes.forEach((cb) => {
    const idx = parseInt(cb.dataset.index);
    const field = cb.dataset.field;
    if (tabCompteurs[idx]) {
      tabCompteurs[idx][field] = cb.checked;
    }
  });
  tabCompteurs.forEach((c) => {
    if (c.actif_compteur && !c.enservice_compteur) {
      c.enservice_compteur = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    if (!c.actif_compteur) {
      c.enservice_compteur = "";
    }
  });
  localStorage.setItem("tabCompteurs", JSON.stringify(tabCompteurs));
  fillCompteurSelect();
  renderActiverCheckList();
  showMessage("Modifications enregistrées.");
}

function remplirSelectModifier() {
  const select = document.getElementById("modifierSelectCompteur");
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '<option value="">Choisir...</option>';
  tabCompteurs.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id_compteur;
    opt.textContent = `${c.id_compteur} — ${c.nom_compteur}`;
    select.appendChild(opt);
  });
  select.value = currentVal;
}

function chargerCompteurDansFormModifier() {
  const id = document.getElementById("modifierSelectCompteur").value;
  const container = document.getElementById("modifierFormContainer");
  if (!id) {
    container.style.display = "none";
    return;
  }
  const c = tabCompteurs.find((x) => x.id_compteur === id);
  if (!c) {
    container.style.display = "none";
    return;
  }
  container.style.display = "block";
  document.getElementById("modifierIdCompteur").value = c.id_compteur;
  document.getElementById("modifierNom").value = c.nom_compteur;
  document.getElementById("modifierUnite").value = c.unite_compteur;
  document.getElementById("modifierDebut").value = c.debut_compteur;
  document.getElementById("modifierRange").value = c.range_compteur;
  document.getElementById("modifierDescription").value = c.description_compteur;
  document.getElementById("modifierVisible").checked = c.visible_compteur;
  document.getElementById("modifierActif").checked = c.actif_compteur;
  fillSelectFromArray("modifierSection", sections, "Sélectionner...");
  fillSelectFromArray("modifierFamille", famille_list, "Sélectionner...");
  fillSelectFromArray("modifierGroupe1", groupe1_list, "Sélectionner...");
  fillSelectFromArray("modifierGroupe2", groupe2_list, "Sélectionner...");
  document.getElementById("modifierSection").value = c.section_compteur;
  document.getElementById("modifierFamille").value = c.famille_compteur;
  document.getElementById("modifierGroupe1").value = c.groupe1_compteur;
  document.getElementById("modifierGroupe2").value = c.groupe2_compteur;
}

function enregistrerModification() {
  const id = document.getElementById("modifierSelectCompteur").value;
  if (!id) {
    showMessage("Veuillez sélectionner un compteur", "error");
    return;
  }
  const c = tabCompteurs.find((x) => x.id_compteur === id);
  if (!c) return;
  const newId = document.getElementById("modifierIdCompteur").value.trim();
  if (newId !== id && tabCompteurs.find((x) => x.id_compteur === newId)) {
    showMessage("Cet ID existe déjà.", "error");
    return;
  }
  c.id_compteur = newId;
  c.nom_compteur = document.getElementById("modifierNom").value;
  c.unite_compteur = document.getElementById("modifierUnite").value;
  c.debut_compteur = parseFloat(document.getElementById("modifierDebut").value);
  c.range_compteur = parseFloat(document.getElementById("modifierRange").value);
  c.section_compteur = document.getElementById("modifierSection").value;
  c.famille_compteur = document.getElementById("modifierFamille").value;
  c.groupe1_compteur = document.getElementById("modifierGroupe1").value;
  c.groupe2_compteur = document.getElementById("modifierGroupe2").value;
  c.description_compteur = document.getElementById("modifierDescription").value;
  c.visible_compteur = document.getElementById("modifierVisible").checked;
  c.actif_compteur = document.getElementById("modifierActif").checked;
  if (c.actif_compteur && !c.enservice_compteur) {
    c.enservice_compteur = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }
  if (!c.actif_compteur) c.enservice_compteur = "";
  localStorage.setItem("tabCompteurs", JSON.stringify(tabCompteurs));
  fillCompteurSelect();
  remplirSelectModifier();
  showMessage(`Compteur "${newId}" modifié.`);
}

function remplirSelectCloner() {
  const select = document.getElementById("clonerSelectParent");
  if (!select) return;
  select.innerHTML = '<option value="">Choisir...</option>';
  tabCompteurs.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id_compteur;
    opt.textContent = `${c.id_compteur} — ${c.nom_compteur}`;
    select.appendChild(opt);
  });
  document.getElementById("clonerApercu").style.display = "none";
}

function afficherApercuClone() {
  const id = document.getElementById("clonerSelectParent").value;
  const apercu = document.getElementById("clonerApercu");
  const content = document.getElementById("clonerApercuContent");
  if (!id) {
    apercu.style.display = "none";
    return;
  }
  const c = tabCompteurs.find((x) => x.id_compteur === id);
  if (!c) {
    apercu.style.display = "none";
    return;
  }
  apercu.style.display = "block";
  const clone = { ...c, id_compteur: "[NOUVEL ID]" };
  content.textContent = JSON.stringify(clone, null, 2);
}

function executerClonage() {
  const parentId = document.getElementById("clonerSelectParent").value;
  const nouvelId = document.getElementById("clonerNouvelId").value.trim();
  if (!parentId) {
    showMessage("Veuillez sélectionner un compteur parent.", "error");
    return;
  }
  if (!nouvelId) {
    showMessage("Veuillez saisir un nouvel ID.", "error");
    return;
  }
  if (tabCompteurs.find((c) => c.id_compteur === nouvelId)) {
    showMessage("Cet ID existe déjà.", "error");
    return;
  }
  const parent = tabCompteurs.find((c) => c.id_compteur === parentId);
  if (!parent) return;
  const clone = {
    ...parent,
    id_compteur: nouvelId,
    enservice_compteur: "",
    visible_compteur: true,
    actif_compteur: true,
  };
  tabCompteurs.push(clone);
  localStorage.setItem("tabCompteurs", JSON.stringify(tabCompteurs));
  document.getElementById("clonerNouvelId").value = "";
  document.getElementById("clonerApercu").style.display = "none";
  remplirSelectCloner();
  remplirSelectModifier();
  fillCompteurSelect();
  showMessage(`Compteur cloné : ${nouvelId}`);
}

function creerCompteur() {
  const id = document.getElementById("creerIdCompteur").value.trim();
  if (!id) {
    showMessage("L'ID compteur est obligatoire.", "error");
    return;
  }
  if (tabCompteurs.find((c) => c.id_compteur === id)) {
    showMessage("Cet ID existe déjà.", "error");
    return;
  }
  const actif = document.getElementById("creerActif").checked;
  const nouveau = {
    id_compteur: id,
    nom_compteur: document.getElementById("creerNom").value,
    unite_compteur: document.getElementById("creerUnite").value,
    debut_compteur: parseFloat(
      document.getElementById("creerDebut").value || 0,
    ),
    range_compteur: parseFloat(
      document.getElementById("creerRange").value || 0,
    ),
    section_compteur: document.getElementById("creerSection").value,
    famille_compteur: document.getElementById("creerFamille").value,
    groupe1_compteur: document.getElementById("creerGroupe1").value,
    groupe2_compteur: document.getElementById("creerGroupe2").value,
    description_compteur: document.getElementById("creerDescription").value,
    visible_compteur: document.getElementById("creerVisible").checked,
    actif_compteur: actif,
    enservice_compteur: actif
      ? new Date().toISOString().slice(0, 19).replace("T", " ")
      : "",
  };
  tabCompteurs.push(nouveau);
  localStorage.setItem("tabCompteurs", JSON.stringify(tabCompteurs));
  document.getElementById("creerIdCompteur").value = "";
  document.getElementById("creerNom").value = "";
  document.getElementById("creerUnite").value = "";
  document.getElementById("creerDebut").value = "";
  document.getElementById("creerRange").value = "";
  document.getElementById("creerSection").value = "";
  document.getElementById("creerFamille").value = "";
  document.getElementById("creerGroupe1").value = "";
  document.getElementById("creerGroupe2").value = "";
  document.getElementById("creerDescription").value = "";
  document.getElementById("creerVisible").checked = true;
  document.getElementById("creerActif").checked = true;
  remplirSelectModifier();
  remplirSelectCloner();
  fillCompteurSelect();
  showMessage(`Compteur "${id}" créé.`);
}

function setupGestionCompteurs() {
  document
    .getElementById("goToActiverCompteur")
    ?.addEventListener("click", () => showPanel("activerCompteurPanel"));
  document
    .getElementById("goToModifierCompteur")
    ?.addEventListener("click", () => showPanel("modifierCompteurPanel"));
  document
    .getElementById("goToClonerCompteur")
    ?.addEventListener("click", () => showPanel("clonerCompteurPanel"));
  document
    .getElementById("goToCreerCompteur")
    ?.addEventListener("click", () => showPanel("creerCompteurPanel"));
  document
    .getElementById("goToQrCodeCompteur")
    ?.addEventListener("click", () => showPanel("qrCodeCompteurPanel"));

  document
    .getElementById("backFromCompteursMenu")
    ?.addEventListener("click", () => showPanel("releveForm"));
  document
    .getElementById("backFromActiver")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("backFromModifier")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("backFromCloner")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("backFromCreer")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("backFromQrCode")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));

  document
    .getElementById("enregistrerActiverBtn")
    ?.addEventListener("click", enregistrerActiver);
  document
    .getElementById("modifierSelectCompteur")
    ?.addEventListener("change", chargerCompteurDansFormModifier);
  document
    .getElementById("enregistrerModifierBtn")
    ?.addEventListener("click", enregistrerModification);
  document
    .getElementById("annulerModifier")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("clonerSelectParent")
    ?.addEventListener("change", afficherApercuClone);
  document
    .getElementById("executerClonerBtn")
    ?.addEventListener("click", executerClonage);
  document
    .getElementById("annulerCloner")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));
  document
    .getElementById("executerCreerBtn")
    ?.addEventListener("click", creerCompteur);
  document
    .getElementById("annulerCreer")
    ?.addEventListener("click", () => showPanel("gestionCompteursMenu"));

  document
    .getElementById("qrSelectCompteur")
    ?.addEventListener("change", function () {
      const idCompteur = this.value;
      const container = document.getElementById("qrCodeContainer");
      const svgDiv = document.getElementById("qrCodeSvg");
      const infos = document.getElementById("qrCodeInfos");
      if (!idCompteur) {
        container.style.display = "none";
        return;
      }
      const compteur = tabCompteurs.find((c) => c.id_compteur === idCompteur);
      if (!compteur) return;
      const typeNumber = 0;
      const errorCorrectionLevel = "L";
      const qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(idCompteur);
      qr.make();
      const moduleCount = qr.getModuleCount();
      const moduleSize = 20;
      const size = moduleCount * moduleSize;
      const widthMm = ((size * 25.4) / 96).toFixed(1);
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="width: ${widthMm}mm; height: ${widthMm}mm; shape-rendering: crispEdges;">`;
      svg += `<rect width="${size}" height="${size}" fill="white"/>`;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = col * moduleSize;
            const y = row * moduleSize;
            svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
          }
        }
      }
      svg += `</svg>`;
      svgDiv.innerHTML = svg;
      infos.textContent = `ID: ${compteur.id_compteur} — ${compteur.nom_compteur}`;
      container.style.display = "block";
    });

  document
    .getElementById("telechargerQrBtn")
    ?.addEventListener("click", function () {
      const select = document.getElementById("qrSelectCompteur");
      const idCompteur = select.value;
      if (!idCompteur) return;
      const compteur = tabCompteurs.find((c) => c.id_compteur === idCompteur);
      if (!compteur) return;
      const svgElem = document.querySelector("#qrCodeSvg svg");
      if (!svgElem) return;
      const svgString = new XMLSerializer().serializeToString(svgElem);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${compteur.nom_compteur}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

  fillSelectFromArray("creerSection", sections, "Sélectionner...");
  fillSelectFromArray("creerFamille", famille_list, "Sélectionner...");
  fillSelectFromArray("creerGroupe1", groupe1_list, "Sélectionner...");
  fillSelectFromArray("creerGroupe2", groupe2_list, "Sélectionner...");
}

function setupEventListeners() {
  document
    .getElementById("releveForm")
    ?.addEventListener("submit", handleSubmit);
}

// ============================================================
// CHARGEMENT DES DONNÉES ET INITIALISATION
// ============================================================

function loadSavedData() {
  const hasSections = localStorage.getItem("sections");
  const hasTypeRonde = localStorage.getItem("type_ronde");
  const hasTabCompteurs = localStorage.getItem("tabCompteurs");
  const hasRondeDB = localStorage.getItem("rondeDB");

  if (hasSections && hasTypeRonde && hasTabCompteurs && hasRondeDB) {
    sections = JSON.parse(localStorage.getItem("sections"));
    famille_list = JSON.parse(localStorage.getItem("famille_list"));
    groupe1_list = JSON.parse(localStorage.getItem("groupe1_list"));
    groupe2_list = JSON.parse(localStorage.getItem("groupe2_list"));
    type_ronde = JSON.parse(hasTypeRonde);
    tabCompteurs = JSON.parse(hasTabCompteurs);
    rondeDB = JSON.parse(hasRondeDB);
  } else {
    initDatabase();
  }

  tabOperateurs = JSON.parse(localStorage.getItem("tabOperateurs"));
  fillRondeSelect();
  fillCompteurSelect();
}

function init() {
  loadSavedData();
  remplirOperateursSelect();
  setupEventListeners();
  setupSidebar();
  setupGestionOperateurs();
  setupGestionRondes();
  setupGestionCompteurs();
  setupChoixRonde();

  document.getElementById("loginBtn").addEventListener("click", handleLogin);
  document.getElementById("bypassLink").addEventListener("click", function (e) {
    e.preventDefault();
    bypassLogin();
  });
  document.getElementById("loginMdp").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  });

  document.getElementById("scanQrBtn").addEventListener("click", ouvrirScanner);
  document
    .getElementById("annulerScanBtn")
    .addEventListener("click", actionAnnulerScan);
  document
    .getElementById("continuerScanBtn")
    .addEventListener("click", actionContinuerScan);
  document
    .getElementById("manualEntryBtn")
    ?.addEventListener("click", actionSaisieManuelle);

  document
    .getElementById("confirmerRecapBtn")
    .addEventListener("click", confirmerReleve);
  document
    .getElementById("annulerRecapBtn")
    .addEventListener("click", annulerReleve);
  document
    .getElementById("continuerRondeBtn")
    .addEventListener("click", continuerRonde);
  document
    .getElementById("finirRondeBtn")
    .addEventListener("click", finirRonde);
  document
    .getElementById("finRondeFinBtn")
    .addEventListener("click", finRondeFin);
  document
    .getElementById("finRondeNouvelleSessionBtn")
    .addEventListener("click", finRondeNouvelleSession);

  document
    .getElementById("resetLinkFooter")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        confirm(
          "ATTENTION : Réinitialisation complète.\n\nToutes les données seront supprimées et l'application redémarrera.\n\nContinuer ?",
        )
      ) {
        if (confirm("Dernière confirmation : Êtes-vous sûr ?")) {
          localStorage.clear();
          sessionStorage.clear();
          location.reload();
        }
      }
    });

  // Démarrer sur le panel de login
  document.getElementById("loginPanel").style.display = "block";
}

init();

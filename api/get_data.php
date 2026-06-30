<?php
require_once 'config/db.php';

/**
 * Récupère toutes les données de configuration pour l'application
 */

$pdo = getDBConnection();

$response = [
    "sections" => [],
    "familles" => [],
    "type_ronde" => [],
    "operateurs" => [],
    "compteurs" => []
];

try {
    // Sections
    $stmt = $pdo->query("SELECT nom FROM sections ORDER BY nom");
    $response["sections"] = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Familles
    $stmt = $pdo->query("SELECT nom FROM familles ORDER BY nom");
    $response["familles"] = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Types de rondes
    $stmt = $pdo->query("SELECT id as id_ronde, ronde, delai_minutes as delai, description_ronde FROM type_ronde ORDER BY id");
    $response["type_ronde"] = $stmt->fetchAll();

    // Opérateurs (on ne renvoie pas les mots de passe pour des raisons de sécurité)
    $stmt = $pdo->query("SELECT id_operateur, nom_operateur, prenom_operateur, fonction_operateur, nomuser_operateur, role FROM operateurs ORDER BY nom_operateur");
    $response["operateurs"] = $stmt->fetchAll();

    // Compteurs
    $query = "
        SELECT 
            c.id_compteur, c.nom_compteur, c.unite_compteur, c.debut_compteur, c.range_compteur,
            s.nom as section_compteur, f.nom as famille_compteur,
            c.enservice_compteur, c.visible_compteur, c.actif_compteur, c.description_compteur
        FROM compteurs c
        LEFT JOIN sections s ON c.section_id = s.id
        LEFT JOIN familles f ON c.famille_id = f.id
        ORDER BY c.id_compteur
    ";
    $stmt = $pdo->query($query);
    $compteurs = $stmt->fetchAll();
    
    // Conversion des types pour correspondre au format JS
    foreach ($compteurs as &$c) {
        $c['visible_compteur'] = (bool)$c['visible_compteur'];
        $c['actif_compteur'] = (bool)$c['actif_compteur'];
        $c['debut_compteur'] = (float)$c['debut_compteur'];
        $c['range_compteur'] = (float)$c['range_compteur'];
    }
    $response["compteurs"] = $compteurs;

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la récupération des données : " . $e->getMessage()]);
}

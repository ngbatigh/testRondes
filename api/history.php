<?php
require_once 'config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = getDBConnection();

    // Paramètres de filtrage optionnels
    $compteurId = $_GET['compteur'] ?? null;
    $dateDebut = $_GET['date_debut'] ?? null;
    $dateFin = $_GET['date_fin'] ?? null;
    $operateurId = $_GET['operateur'] ?? null;
    $rondeId = $_GET['ronde'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 200;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    $query = "
        SELECT 
            r.id, r.id_ronde, r.id_operateur, r.id_compteur, r.valeur,
            r.date_releve, r.heure_releve, r.commentaire, r.date_saisie,
            o.nom_operateur, o.prenom_operateur,
            c.nom_compteur, c.unite_compteur,
            t.ronde as type_ronde_nom
        FROM releves r
        JOIN operateurs o ON r.id_operateur = o.id_operateur
        JOIN compteurs c ON r.id_compteur = c.id_compteur
        JOIN type_ronde t ON r.id_ronde = t.id
        WHERE 1=1
    ";

    $params = [];

    if ($compteurId) {
        $query .= " AND r.id_compteur = :compteur";
        $params[':compteur'] = $compteurId;
    }
    if ($dateDebut) {
        $query .= " AND r.date_releve >= :date_debut";
        $params[':date_debut'] = $dateDebut;
    }
    if ($dateFin) {
        $query .= " AND r.date_releve <= :date_fin";
        $params[':date_fin'] = $dateFin;
    }
    if ($operateurId) {
        $query .= " AND r.id_operateur = :operateur";
        $params[':operateur'] = $operateurId;
    }
    if ($rondeId) {
        $query .= " AND r.id_ronde = :ronde";
        $params[':ronde'] = $rondeId;
    }

    $query .= " ORDER BY r.date_releve DESC, r.heure_releve DESC LIMIT :limit OFFSET :offset";

    // Compter le total pour la pagination
    $countQuery = "
        SELECT COUNT(*) as total
        FROM releves r
        WHERE 1=1
    ";
    if ($compteurId) $countQuery .= " AND r.id_compteur = :compteur";
    if ($dateDebut) $countQuery .= " AND r.date_releve >= :date_debut";
    if ($dateFin) $countQuery .= " AND r.date_releve <= :date_fin";
    if ($operateurId) $countQuery .= " AND r.id_operateur = :operateur";
    if ($rondeId) $countQuery .= " AND r.id_ronde = :ronde";

    $stmtCount = $pdo->prepare($countQuery);
    $stmtCount->execute($params);
    $total = $stmtCount->fetchColumn();

    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->execute();
    $releves = $stmt->fetchAll();

    // Conversion des types
    foreach ($releves as &$r) {
        $r['valeur'] = (float)$r['valeur'];
        $r['date_releve'] = date('d/m/Y', strtotime($r['date_releve']));
        $r['heure_releve'] = date('H:i', strtotime($r['heure_releve']));
        $r['operateur_nom'] = $r['prenom_operateur'] . ' ' . $r['nom_operateur'];
    }

    echo json_encode([
        "success" => true,
        "total" => (int)$total,
        "limit" => $limit,
        "offset" => $offset,
        "data" => $releves
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
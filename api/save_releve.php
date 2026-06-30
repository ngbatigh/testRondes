<?php
require_once 'config/db.php';

/**
 * Enregistre les relevés d'une session
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['releves']) || !is_array($data['releves'])) {
    http_response_code(400);
    echo json_encode(["error" => "Données invalides ou manquantes"]);
    exit;
}

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO releves (id_ronde, id_operateur, id_compteur, valeur, date_releve, heure_releve, commentaire)
        VALUES (:id_ronde, :id_operateur, :id_compteur, :valeur, :date_releve, :heure_releve, :commentaire)
    ");

    $count = 0;
    foreach ($data['releves'] as $releve) {
        $stmt->execute([
            ':id_ronde'     => $releve['id_ronde'],
            ':id_operateur' => $releve['id_operateur'],
            ':id_compteur'  => $releve['id_compteur'],
            ':valeur'       => $releve['valeur'],
            ':date_releve'  => $releve['date'],
            ':heure_releve' => $releve['heure'],
            ':commentaire'  => isset($releve['commentaire']) ? $releve['commentaire'] : ''
        ]);
        $count++;
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "$count relevé(s) enregistré(s) avec succès",
        "count" => $count
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de l'enregistrement : " . $e->getMessage()]);
}

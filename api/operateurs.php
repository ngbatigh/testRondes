<?php
require_once 'config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("
                SELECT id_operateur, nom_operateur, prenom_operateur, 
                       fonction_operateur, nomuser_operateur, role
                FROM operateurs 
                ORDER BY nom_operateur
            ");
            $operateurs = $stmt->fetchAll();
            echo json_encode($operateurs);
            break;

        case 'POST':
            $input = json_decode(file_get_contents("php://input"), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO operateurs 
                (id_operateur, nom_operateur, prenom_operateur, fonction_operateur, 
                 nomuser_operateur, motdepasse_operateur, role)
                VALUES 
                (:id_operateur, :nom_operateur, :prenom_operateur, :fonction_operateur,
                 :nomuser_operateur, :motdepasse_operateur, :role)
            ");
            
            $stmt->execute([
                ':id_operateur' => $input['id_operateur'],
                ':nom_operateur' => $input['nom_operateur'],
                ':prenom_operateur' => $input['prenom_operateur'],
                ':fonction_operateur' => $input['fonction_operateur'] ?? '',
                ':nomuser_operateur' => $input['nomuser_operateur'],
                ':motdepasse_operateur' => $input['motdepasse_operateur'] ?? '',
                ':role' => $input['role'] ?? 'operateur'
            ]);
            
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Opérateur créé"]);
            break;

        case 'PUT':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_operateur'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID opérateur requis"]);
                exit;
            }
            
            $stmt = $pdo->prepare("
                UPDATE operateurs 
                SET nom_operateur = :nom_operateur,
                    prenom_operateur = :prenom_operateur,
                    fonction_operateur = :fonction_operateur,
                    nomuser_operateur = :nomuser_operateur,
                    motdepasse_operateur = :motdepasse_operateur,
                    role = :role
                WHERE id_operateur = :id_operateur
            ");
            
            $stmt->execute([
                ':id_operateur' => $input['id_operateur'],
                ':nom_operateur' => $input['nom_operateur'],
                ':prenom_operateur' => $input['prenom_operateur'],
                ':fonction_operateur' => $input['fonction_operateur'] ?? '',
                ':nomuser_operateur' => $input['nomuser_operateur'],
                ':motdepasse_operateur' => $input['motdepasse_operateur'] ?? '',
                ':role' => $input['role'] ?? 'operateur'
            ]);
            
            echo json_encode(["success" => true, "message" => "Opérateur modifié"]);
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_operateur'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID opérateur requis"]);
                exit;
            }
            
            $stmt = $pdo->prepare("DELETE FROM operateurs WHERE id_operateur = :id_operateur");
            $stmt->execute([':id_operateur' => $input['id_operateur']]);
            
            echo json_encode(["success" => true, "message" => "Opérateur supprimé"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Méthode non autorisée"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
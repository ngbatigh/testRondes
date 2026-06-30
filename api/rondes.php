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
                SELECT id as id_ronde, ronde, delai_minutes as delai, description_ronde
                FROM type_ronde 
                ORDER BY id
            ");
            $rondes = $stmt->fetchAll();
            echo json_encode($rondes);
            break;

        case 'POST':
            $input = json_decode(file_get_contents("php://input"), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO type_ronde (ronde, delai_minutes, description_ronde)
                VALUES (:ronde, :delai, :description)
            ");
            
            $stmt->execute([
                ':ronde' => $input['ronde'],
                ':delai' => $input['delai'],
                ':description' => $input['description_ronde'] ?? ''
            ]);
            
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Type de ronde créé"]);
            break;

        case 'PUT':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_ronde'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID ronde requis"]);
                exit;
            }
            
            $stmt = $pdo->prepare("
                UPDATE type_ronde 
                SET ronde = :ronde,
                    delai_minutes = :delai,
                    description_ronde = :description
                WHERE id = :id_ronde
            ");
            
            $stmt->execute([
                ':id_ronde' => $input['id_ronde'],
                ':ronde' => $input['ronde'],
                ':delai' => $input['delai'],
                ':description' => $input['description_ronde'] ?? ''
            ]);
            
            echo json_encode(["success" => true, "message" => "Type de ronde modifié"]);
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_ronde'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID ronde requis"]);
                exit;
            }
            
            $stmt = $pdo->prepare("DELETE FROM type_ronde WHERE id = :id_ronde");
            $stmt->execute([':id_ronde' => $input['id_ronde']]);
            
            echo json_encode(["success" => true, "message" => "Type de ronde supprimé"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Méthode non autorisée"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
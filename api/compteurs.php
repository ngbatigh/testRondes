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

    // Récupération de toutes les sections et familles pour la résolution des IDs
    $stmt = $pdo->query("SELECT id, nom FROM sections");
    $sections = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    $stmt = $pdo->query("SELECT id, nom FROM familles");
    $familles = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    switch ($method) {
        case 'GET':
            // Récupération de tous les compteurs
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
            
            // Conversion des types
            foreach ($compteurs as &$c) {
                $c['visible_compteur'] = (bool)$c['visible_compteur'];
                $c['actif_compteur'] = (bool)$c['actif_compteur'];
                $c['debut_compteur'] = (float)$c['debut_compteur'];
                $c['range_compteur'] = (float)$c['range_compteur'];
            }
            
            echo json_encode($compteurs);
            break;

        case 'POST':
            // Création d'un compteur
            $input = json_decode(file_get_contents("php://input"), true);
            
            // Résolution des IDs section et famille
            $section_id = null;
            if (isset($input['section_compteur']) && $input['section_compteur']) {
                $section_id = array_search($input['section_compteur'], $sections);
            }
            $famille_id = null;
            if (isset($input['famille_compteur']) && $input['famille_compteur']) {
                $famille_id = array_search($input['famille_compteur'], $familles);
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO compteurs 
                (id_compteur, nom_compteur, unite_compteur, debut_compteur, range_compteur, 
                 section_id, famille_id, enservice_compteur, visible_compteur, actif_compteur, description_compteur)
                VALUES 
                (:id_compteur, :nom_compteur, :unite_compteur, :debut_compteur, :range_compteur,
                 :section_id, :famille_id, :enservice_compteur, :visible_compteur, :actif_compteur, :description_compteur)
            ");
            
            $stmt->execute([
                ':id_compteur' => $input['id_compteur'],
                ':nom_compteur' => $input['nom_compteur'],
                ':unite_compteur' => $input['unite_compteur'] ?? '',
                ':debut_compteur' => $input['debut_compteur'] ?? 0,
                ':range_compteur' => $input['range_compteur'] ?? 0,
                ':section_id' => $section_id,
                ':famille_id' => $famille_id,
                ':enservice_compteur' => $input['enservice_compteur'] ?? null,
                ':visible_compteur' => $input['visible_compteur'] ?? true,
                ':actif_compteur' => $input['actif_compteur'] ?? true,
                ':description_compteur' => $input['description_compteur'] ?? ''
            ]);
            
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Compteur créé"]);
            break;

        case 'PUT':
            // Modification d'un compteur
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_compteur'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID compteur requis"]);
                exit;
            }
            
            // Résolution des IDs section et famille
            $section_id = null;
            if (isset($input['section_compteur']) && $input['section_compteur']) {
                $section_id = array_search($input['section_compteur'], $sections);
            }
            $famille_id = null;
            if (isset($input['famille_compteur']) && $input['famille_compteur']) {
                $famille_id = array_search($input['famille_compteur'], $familles);
            }
            
            $stmt = $pdo->prepare("
                UPDATE compteurs 
                SET nom_compteur = :nom_compteur,
                    unite_compteur = :unite_compteur,
                    debut_compteur = :debut_compteur,
                    range_compteur = :range_compteur,
                    section_id = :section_id,
                    famille_id = :famille_id,
                    enservice_compteur = :enservice_compteur,
                    visible_compteur = :visible_compteur,
                    actif_compteur = :actif_compteur,
                    description_compteur = :description_compteur
                WHERE id_compteur = :id_compteur
            ");
            
            $stmt->execute([
                ':id_compteur' => $input['id_compteur'],
                ':nom_compteur' => $input['nom_compteur'],
                ':unite_compteur' => $input['unite_compteur'] ?? '',
                ':debut_compteur' => $input['debut_compteur'] ?? 0,
                ':range_compteur' => $input['range_compteur'] ?? 0,
                ':section_id' => $section_id,
                ':famille_id' => $famille_id,
                ':enservice_compteur' => $input['enservice_compteur'] ?? null,
                ':visible_compteur' => $input['visible_compteur'] ?? true,
                ':actif_compteur' => $input['actif_compteur'] ?? true,
                ':description_compteur' => $input['description_compteur'] ?? ''
            ]);
            
            echo json_encode(["success" => true, "message" => "Compteur modifié"]);
            break;

        case 'DELETE':
            // Suppression d'un compteur
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($input['id_compteur'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID compteur requis"]);
                exit;
            }
            
            $stmt = $pdo->prepare("DELETE FROM compteurs WHERE id_compteur = :id_compteur");
            $stmt->execute([':id_compteur' => $input['id_compteur']]);
            
            echo json_encode(["success" => true, "message" => "Compteur supprimé"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Méthode non autorisée"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
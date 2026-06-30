<?php
require_once 'config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Identifiants requis"]);
    exit;
}

$username = $input['username'];
$password = $input['password'];

try {
    $pdo = getDBConnection();
    
    // Recherche de l'opérateur par nom d'utilisateur
    $stmt = $pdo->prepare("
        SELECT id_operateur, nom_operateur, prenom_operateur, fonction_operateur, 
               nomuser_operateur, role, motdepasse_operateur
        FROM operateurs 
        WHERE nomuser_operateur = :username
    ");
    $stmt->execute([':username' => $username]);
    $operateur = $stmt->fetch();
    
    if (!$operateur) {
        http_response_code(401);
        echo json_encode(["error" => "Identifiants incorrects"]);
        exit;
    }
    
    // Vérification du mot de passe (en clair dans ce projet, mais à remplacer par password_verify en production)
    if ($operateur['motdepasse_operateur'] !== $password) {
        http_response_code(401);
        echo json_encode(["error" => "Identifiants incorrects"]);
        exit;
    }
    
    // Suppression du mot de passe de la réponse
    unset($operateur['motdepasse_operateur']);
    
    // Démarrage de session
    session_start();
    $_SESSION['operateur'] = $operateur;
    
    echo json_encode([
        "success" => true,
        "operateur" => $operateur
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la connexion : " . $e->getMessage()]);
}
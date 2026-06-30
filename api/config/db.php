<?php
/**
 * Configuration de la base de données
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'gestion_rondes');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // En production, ne pas afficher les détails de l'erreur
        http_response_code(500);
        echo json_encode(["error" => "Erreur de connexion à la base de données : " . $e->getMessage()]);
        exit;
    }
}

/**
 * En-têtes CORS pour autoriser les requêtes de l'application front-end
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

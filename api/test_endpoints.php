<?php
/**
 * Script de test des endpoints API
 * Usage : http://localhost/api/test_endpoints.php
 */

require_once 'config/db.php';

header("Content-Type: text/html; charset=UTF-8");

echo "<!DOCTYPE html><html><head><title>Tests API</title></head><body>";
echo "<h1>🧪 Tests des Endpoints API</h1>";
echo "<style>body { font-family: monospace; padding: 20px; } .pass { color: green; } .fail { color: red; } .info { color: blue; }</style>";

$results = [];
$baseUrl = "http://localhost/api/"; // A adapter selon l'environnement

function testEndpoint($name, $url, $method = 'GET', $data = null) {
    global $results;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $results[$name] = [
        'code' => $httpCode,
        'response' => $response,
        'success' => $httpCode >= 200 && $httpCode < 300
    ];
    
    return $results[$name];
}

// Test 1 : get_data.php
testEndpoint("GET /api/get_data.php", $baseUrl . "get_data.php");

// Test 2 : login.php (avec credentials par défaut)
testEndpoint("POST /api/login.php", $baseUrl . "login.php", 'POST', [
    'username' => 'gbati@nadjombe',
    'password' => 'admin'
]);

// Test 3 : compteurs.php (GET)
testEndpoint("GET /api/compteurs.php", $baseUrl . "compteurs.php");

// Test 4 : operateurs.php (GET)
testEndpoint("GET /api/operateurs.php", $baseUrl . "operateurs.php");

// Test 5 : rondes.php (GET)
testEndpoint("GET /api/rondes.php", $baseUrl . "rondes.php");

// Test 6 : history.php (GET)
testEndpoint("GET /api/history.php", $baseUrl . "history.php");

// Affichage des résultats
echo "<h2>Résultats :</h2>";
$passCount = 0;
$failCount = 0;

foreach ($results as $name => $result) {
    $status = $result['success'] ? '✅ PASS' : '❌ FAIL';
    $class = $result['success'] ? 'pass' : 'fail';
    
    echo "<div class='$class'>";
    echo "<strong>$status</strong> : $name (HTTP {$result['code']})";
    
    if (!$result['success']) {
        echo "<br><pre>" . htmlspecialchars($result['response']) . "</pre>";
    }
    echo "</div>";
    
    if ($result['success']) $passCount++;
    else $failCount++;
}

echo "<h2>📊 Statistiques :</h2>";
echo "<p>Tests réussis : <span class='pass'>$passCount</span></p>";
echo "<p>Tests échoués : <span class='fail'>$failCount</span></p>";
echo "<p>Total : " . count($results) . " tests</p>";

if ($failCount === 0) {
    echo "<h2 class='pass'>🎉 Tous les tests sont passés !</h2>";
} else {
    echo "<h2 class='fail'>⚠️ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.</h2>";
}

echo "</body></html>";
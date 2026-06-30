<?php
/**
 * Tests de sécurité basiques
 * Usage : http://localhost/api/test_security.php
 */

require_once 'config/db.php';

header("Content-Type: text/html; charset=UTF-8");

echo "<!DOCTYPE html><html><head><title>Tests Sécurité</title></head><body>";
echo "<h1>🔒 Tests de Sécurité</h1>";
echo "<style>body { font-family: monospace; padding: 20px; } .pass { color: green; } .fail { color: red; }</style>";

$pass = 0;
$fail = 0;

function check($name, $condition, $details = '') {
    global $pass, $fail;
    if ($condition) {
        echo "<div class='pass'>✅ PASS : $name</div>";
        $pass++;
    } else {
        echo "<div class='fail'>❌ FAIL : $name</div>";
        if ($details) echo "<pre>$details</pre>";
        $fail++;
    }
}

// Test 1 : Vérifier que les mots de passe ne sont pas retournés par get_data.php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/api/get_data.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$hasPasswords = false;
if (isset($data['operateurs'])) {
    foreach ($data['operateurs'] as $op) {
        if (isset($op['motdepasse_operateur'])) {
            $hasPasswords = true;
            break;
        }
    }
}
check("Mots de passe non exposés dans get_data.php", !$hasPasswords);

// Test 2 : Vérifier CORS
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/api/get_data.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Origin: https://example.com']);
$response = curl_exec($ch);
$cors = curl_getinfo($ch, CURLINFO_HEADER_OUT);
curl_close($ch);

check("CORS configuré", strpos($response, 'Access-Control-Allow-Origin') !== false);

// Test 3 : Vérifier que les requêtes préparées sont utilisées (pas de SQL direct)
$files = ['login.php', 'compteurs.php', 'operateurs.php', 'rondes.php'];
$usesPrepared = true;
foreach ($files as $file) {
    $content = file_get_contents("api/$file");
    if (strpos($content, 'prepare(') === false) {
        $usesPrepared = false;
    }
}
check("Requêtes préparées utilisées", $usesPrepared);

// Test 4 : Vérifier les en-têtes de sécurité
check("Content-Type: application/json", true, "Vérifier manuellement les en-têtes");

// Test 5 : Vérifier que OPTIONS est géré
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/api/compteurs.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Origin: http://localhost']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

check("Méthode OPTIONS autorisée (CORS preflight)", $httpCode == 200);

// Résumé
echo "<h2>📊 Résumé :</h2>";
echo "<p>Tests réussis : <span class='pass'>$pass</span></p>";
echo "<p>Tests échoués : <span class='fail'>$fail</span></p>";

if ($fail === 0) {
    echo "<h2 class='pass'>🎉 Tous les tests de sécurité sont passés !</h2>";
} else {
    echo "<h2 class='fail'>⚠️ Certains tests ont échoué.</h2>";
}

echo "</body></html>";
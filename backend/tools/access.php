<?php
/**
 * Interface d'administration de la base de données
 * Accès : https://mondomaine.com/backend/tools/access.php
 * 
 * ATTENTION : Protéger ce fichier par mot de passe en production !
 * - Supprimer le fichier après déploiement initial
 * - Ou restreindre par IP via .htaccess
 */

require_once __DIR__ . '/../config/db.php';

session_start();

// Mot de passe administrateur (à changer impérativement)
define('ADMIN_PASSWORD', 'admin123');

$authenticated = isset($_SESSION['access_authenticated']) && $_SESSION['access_authenticated'] === true;

// Gestion de la connexion
if (isset($_POST['login'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        $_SESSION['access_authenticated'] = true;
        $authenticated = true;
    } else {
        $error = "Mot de passe incorrect";
    }
}

// Gestion de la déconnexion
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: access.php');
    exit;
}

// Exécution d'une requête SQL personnalisée
$queryResult = null;
$queryError = null;
if ($authenticated && isset($_POST['sql_query'])) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare($_POST['sql_query']);
        $stmt->execute();
        
        if (stripos($_POST['sql_query'], 'SELECT') === 0) {
            $queryResult = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $queryResult = ['affected_rows' => $stmt->rowCount()];
        }
    } catch (Exception $e) {
        $queryError = $e->getMessage();
    }
}

// Récupération des statistiques des tables
$tableStats = [];
if ($authenticated) {
    try {
        $pdo = getDBConnection();
        $tables = ['sections', 'familles', 'type_ronde', 'operateurs', 'compteurs', 'releves'];
        foreach ($tables as $table) {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $tableStats[$table] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        }
    } catch (Exception $e) {
        $tableStats = [];
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration BDD - Gestion Rondes</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; margin-bottom: 20px; font-size: 24px; }
        h2 { color: #444; margin: 20px 0 10px; font-size: 18px; }
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .panel { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        th { background: #f8f9fa; font-weight: 600; color: #555; position: sticky; top: 0; }
        tr:hover { background: #f1f8ff; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .stat-card { background: white; border-radius: 8px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-card .count { font-size: 32px; font-weight: bold; color: #007bff; }
        .stat-card .label { font-size: 13px; color: #666; margin-top: 4px; }
        form { margin: 10px 0; }
        input, textarea, select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; width: 100%; margin-bottom: 10px; }
        textarea { font-family: monospace; min-height: 100px; }
        button, .btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; }
        button:hover { background: #0056b3; }
        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #c82333; }
        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #5a6268; }
        .login-box { max-width: 400px; margin: 100px auto; }
        .login-box h1 { text-align: center; }
        .logout { float: right; text-decoration: none; font-size: 13px; }
        .scroll-table { overflow-x: auto; max-height: 500px; overflow-y: auto; }
        pre { background: #f8f9fa; padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <?php if (!$authenticated): ?>
            <!-- Formulaire de connexion -->
            <div class="login-box panel">
                <h1>🔐 Administration BDD</h1>
                <p style="text-align: center; color: #666; margin: 10px 0;">Gestion des Rondes - MySQL</p>
                <?php if (isset($error)): ?>
                    <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>
                <form method="post">
                    <input type="password" name="password" placeholder="Mot de passe administrateur" required autofocus>
                    <button type="submit" name="login" style="width: 100%;">Se connecter</button>
                </form>
            </div>
        <?php else: ?>
            <!-- Interface administrateur -->
            <div class="panel" style="display: flex; justify-content: space-between; align-items: center;">
                <h1 style="margin: 0;">🛠️ Administration Base de Données</h1>
                <a href="?logout=1" class="btn btn-danger">Déconnexion</a>
            </div>

            <!-- Vue d'ensemble -->
            <div class="panel">
                <h2>📊 Vue d'ensemble</h2>
                <div class="stats-grid">
                    <?php if ($tableStats): ?>
                        <?php foreach ($tableStats as $table => $count): ?>
                            <div class="stat-card">
                                <div class="count"><?= $count ?></div>
                                <div class="label"><?= htmlspecialchars($table) ?></div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>Impossible de charger les statistiques.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Contenu des tables -->
            <div class="panel">
                <h2>📋 Contenu des tables</h2>
                <?php if ($tableStats): ?>
                    <?php foreach ($tableStats as $table => $count): ?>
                        <?php
                        try {
                            $pdo = getDBConnection();
                            $stmt = $pdo->query("SELECT * FROM $table LIMIT 50");
                            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        ?>
                        <h3 style="margin-top: 20px;">📄 <?= htmlspecialchars($table) ?> (<?= $count ?> enregistrements)</h3>
                        <?php if (!empty($rows)): ?>
                            <div class="scroll-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <?php foreach (array_keys($rows[0]) as $col): ?>
                                                <th><?= htmlspecialchars($col) ?></th>
                                            <?php endforeach; ?>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($rows as $row): ?>
                                            <tr>
                                                <?php foreach ($row as $cell): ?>
                                                    <td><?= htmlspecialchars($cell ?? '') ?></td>
                                                <?php endforeach; ?>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                            <?php if ($count > 50): ?>
                                <p style="margin-top: 8px; color: #999;">Affichage des 50 premiers enregistrements (<?= $count ?> total)</p>
                            <?php endif; ?>
                        <?php else: ?>
                            <p style="color: #999;">Table vide</p>
                        <?php endif; ?>
                        <?php
                        } catch (Exception $e) {
                            echo '<div class="alert alert-error">Erreur : ' . htmlspecialchars($e->getMessage()) . '</div>';
                        }
                        ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Exécution de requêtes SQL -->
            <div class="panel">
                <h2>⚡ Exécuter une requête SQL</h2>
                <?php if ($queryResult !== null): ?>
                    <div class="alert alert-success">
                        ✅ Requête exécutée avec succès.
                        <?php if (isset($queryResult['affected_rows'])): ?>
                            Lignes affectées : <?= $queryResult['affected_rows'] ?>
                        <?php endif; ?>
                    </div>
                    <?php if (isset($queryResult[0])): ?>
                        <div class="scroll-table">
                            <table>
                                <thead>
                                    <tr>
                                        <?php foreach (array_keys($queryResult[0]) as $col): ?>
                                            <th><?= htmlspecialchars($col) ?></th>
                                        <?php endforeach; ?>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($queryResult as $row): ?>
                                        <tr>
                                            <?php foreach ($row as $cell): ?>
                                                <td><?= htmlspecialchars($cell ?? 'NULL') ?></td>
                                            <?php endforeach; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                        <p style="margin-top: 8px; color: #999;"><?= count($queryResult) ?> ligne(s)</p>
                    <?php endif; ?>
                <?php endif; ?>
                <?php if ($queryError): ?>
                    <div class="alert alert-error">❌ Erreur : <?= htmlspecialchars($queryError) ?></div>
                <?php endif; ?>
                <form method="post">
                    <textarea name="sql_query" placeholder="Ex: SELECT * FROM compteurs WHERE actif_compteur = 1">SELECT * FROM compteurs LIMIT 10</textarea>
                    <button type="submit">▶️ Exécuter</button>
                </form>
                <p style="margin-top: 8px; color: #999; font-size: 12px;">⚠️ Utilisez cette fonction avec précaution. Les requêtes INSERT, UPDATE, DELETE sont autorisées.</p>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
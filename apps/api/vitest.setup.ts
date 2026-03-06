// Ce fichier est exécuté avant tout import de module dans les tests.
// Il définit les variables d'environnement requises par jwt.service.ts au niveau module.
process.env['JWT_ACCESS_SECRET'] = 'test-access-secret-minimum-32-characters-long';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-minimum-32-characters-long';

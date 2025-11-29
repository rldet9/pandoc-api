/**
 * Script de validation de la spécification OpenAPI
 * 
 * Ce script vérifie que le fichier openapi.json est bien formé
 * et contient tous les éléments requis.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validation de la spécification OpenAPI...\n');

try {
  // Charger le fichier openapi.json
  const openapiPath = path.join(__dirname, 'openapi.json');
  const openapiContent = fs.readFileSync(openapiPath, 'utf8');
  const openapi = JSON.parse(openapiContent);

  // Vérifications de base
  const checks = [
    {
      name: 'Version OpenAPI',
      test: () => openapi.openapi === '3.0.3',
      value: openapi.openapi
    },
    {
      name: 'Titre de l\'API',
      test: () => openapi.info && openapi.info.title === 'Pandoc API',
      value: openapi.info?.title
    },
    {
      name: 'Version de l\'API',
      test: () => openapi.info && openapi.info.version === '1.0.0',
      value: openapi.info?.version
    },
    {
      name: 'Licence',
      test: () => openapi.info && openapi.info.license && openapi.info.license.name === 'MIT',
      value: openapi.info?.license?.name
    },
    {
      name: 'Serveurs définis',
      test: () => openapi.servers && openapi.servers.length > 0,
      value: openapi.servers?.length
    },
    {
      name: 'Tags définis',
      test: () => openapi.tags && openapi.tags.length === 3,
      value: openapi.tags?.length
    },
    {
      name: 'Endpoint GET /',
      test: () => openapi.paths && openapi.paths['/'],
      value: openapi.paths?.['/'] ? '✓' : '✗'
    },
    {
      name: 'Endpoint GET /api/help',
      test: () => openapi.paths && openapi.paths['/api/help'],
      value: openapi.paths?.['/api/help'] ? '✓' : '✗'
    },
    {
      name: 'Endpoint GET /api/templates',
      test: () => openapi.paths && openapi.paths['/api/templates'],
      value: openapi.paths?.['/api/templates'] ? '✓' : '✗'
    },
    {
      name: 'Endpoint POST /api/templates/{format}',
      test: () => openapi.paths && openapi.paths['/api/templates/{format}'],
      value: openapi.paths?.['/api/templates/{format}'] ? '✓' : '✗'
    },
    {
      name: 'Endpoint DELETE /api/templates/{format}/{name}',
      test: () => openapi.paths && openapi.paths['/api/templates/{format}/{name}'],
      value: openapi.paths?.['/api/templates/{format}/{name}'] ? '✓' : '✗'
    },
    {
      name: 'Endpoint POST /api/convert/{command}',
      test: () => openapi.paths && openapi.paths['/api/convert/{command}'],
      value: openapi.paths?.['/api/convert/{command}'] ? '✓' : '✗'
    },
    {
      name: 'Schéma Template',
      test: () => openapi.components && openapi.components.schemas && openapi.components.schemas.Template,
      value: openapi.components?.schemas?.Template ? '✓' : '✗'
    },
    {
      name: 'Schéma Error',
      test: () => openapi.components && openapi.components.schemas && openapi.components.schemas.Error,
      value: openapi.components?.schemas?.Error ? '✓' : '✗'
    },
    {
      name: 'Réponse BadRequest',
      test: () => openapi.components && openapi.components.responses && openapi.components.responses.BadRequest,
      value: openapi.components?.responses?.BadRequest ? '✓' : '✗'
    },
    {
      name: 'Réponse NotFound',
      test: () => openapi.components && openapi.components.responses && openapi.components.responses.NotFound,
      value: openapi.components?.responses?.NotFound ? '✓' : '✗'
    },
    {
      name: 'Réponse Conflict',
      test: () => openapi.components && openapi.components.responses && openapi.components.responses.Conflict,
      value: openapi.components?.responses?.Conflict ? '✓' : '✗'
    }
  ];

  // Exécuter les vérifications
  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    const result = check.test();
    if (result) {
      console.log(`✅ ${check.name}: ${check.value}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}: ${check.value || 'NON TROUVÉ'}`);
      failed++;
    }
  });

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Résultat: ${passed}/${checks.length} vérifications réussies`);
  
  if (failed === 0) {
    console.log('✅ La spécification OpenAPI est valide et complète !');
    console.log('\n📚 Endpoints disponibles:');
    console.log('   - GET  /api-docs (Swagger UI)');
    console.log('   - GET  /openapi.json (Spécification JSON)');
    console.log('   - Ouvrir swagger-ui.html dans un navigateur');
    process.exit(0);
  } else {
    console.log(`❌ ${failed} vérification(s) échouée(s)`);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  process.exit(1);
}

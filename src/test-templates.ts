/**
 * Script de test pour vérifier les fonctions de gestion des templates
 */
import * as templates from './templates';
import * as fs from 'fs';
import * as path from 'path';
import { templatesDir } from './constants';

async function test() {
  console.log('=== Test de la gestion des templates ===\n');
  
  // Test 1: Initialisation
  console.log('1. Initialisation du dossier templates...');
  templates.initTemplatesDirectory();
  console.log(`   ✓ Dossier créé: ${templatesDir}\n`);
  
  // Test 2: Liste vide
  console.log('2. Liste des templates (devrait être vide)...');
  const emptyList = await templates.listTemplates();
  console.log(`   ✓ ${emptyList.length} templates trouvés\n`);
  
  // Test 3: Validation de format
  console.log('3. Validation des formats...');
  const validFormat = templates.validateFormat('html');
  const invalidFormat = templates.validateFormat('invalid');
  console.log(`   ✓ Format 'html' valide: ${validFormat}`);
  console.log(`   ✓ Format 'invalid' invalide: ${!invalidFormat}\n`);
  
  // Test 4: Chemin de template
  console.log('4. Génération de chemin de template...');
  const templatePath = templates.getTemplatePath('html', 'test');
  console.log(`   ✓ Chemin: ${templatePath}\n`);
  
  // Test 5: Création d'un template fictif
  console.log('5. Création d\'un template de test...');
  const testFile = path.join(templatesDir, 'html', 'test.template');
  const htmlDir = path.join(templatesDir, 'html');
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }
  fs.writeFileSync(testFile, '<html>$body$</html>');
  console.log(`   ✓ Fichier créé: ${testFile}\n`);
  
  // Test 6: Liste avec templates
  console.log('6. Liste des templates (devrait contenir 1 template)...');
  const listWithTemplates = await templates.listTemplates();
  console.log(`   ✓ ${listWithTemplates.length} template(s) trouvé(s)`);
  if (listWithTemplates.length > 0) {
    console.log(`   - Nom: ${listWithTemplates[0].name}`);
    console.log(`   - Format: ${listWithTemplates[0].format}`);
    console.log(`   - Taille: ${listWithTemplates[0].size} octets\n`);
  }
  
  // Test 7: Filtrage par format
  console.log('7. Filtrage par format HTML...');
  const htmlTemplates = await templates.listTemplates('html');
  console.log(`   ✓ ${htmlTemplates.length} template(s) HTML trouvé(s)\n`);
  
  // Test 8: Suppression
  console.log('8. Suppression du template de test...');
  await templates.deleteTemplate('html', 'test');
  console.log(`   ✓ Template supprimé\n`);
  
  // Test 9: Vérification après suppression
  console.log('9. Vérification de la suppression...');
  const listAfterDelete = await templates.listTemplates();
  console.log(`   ✓ ${listAfterDelete.length} template(s) restant(s)\n`);
  
  // Test 10: Erreur template inexistant
  console.log('10. Test d\'erreur (template inexistant)...');
  try {
    await templates.deleteTemplate('html', 'nonexistent');
    console.log('   ✗ L\'erreur n\'a pas été levée\n');
  } catch (error) {
    if (error.code === 'template_not_found') {
      console.log(`   ✓ Erreur correctement levée: ${error.code}\n`);
    } else {
      console.log(`   ✗ Erreur inattendue: ${error.message}\n`);
    }
  }
  
  // Test 11: Erreur format invalide
  console.log('11. Test d\'erreur (format invalide)...');
  try {
    const mockFile = {
      path: '/tmp/test.txt',
      originalname: 'test.txt',
    } as any;
    await templates.addTemplate(mockFile, 'invalidformat', 'test');
    console.log('   ✗ L\'erreur n\'a pas été levée\n');
  } catch (error) {
    if (error.code === 'invalid_format') {
      console.log(`   ✓ Erreur correctement levée: ${error.code}\n`);
    } else {
      console.log(`   ✗ Erreur inattendue: ${error.message}\n`);
    }
  }
  
  console.log('=== Tous les tests sont terminés ===');
}

test().catch(console.error);

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { ApiError } from './errors';
import { templatesDir, availableValues } from './constants';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

/**
 * Interface décrivant les informations d'un template
 */
export interface TemplateInfo {
  name: string;
  format: string;
  size: number;
  createdAt: Date;
  path: string;
}

/**
 * Initialise le répertoire des templates
 * Crée le dossier principal et les sous-dossiers pour chaque format supporté
 */
export function initTemplatesDirectory(): void {
  try {
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    // Créer les sous-dossiers pour les formats courants
    const commonFormats = ['html', 'docx', 'pdf', 'latex', 'markdown', 'epub', 'odt', 'pptx'];
    for (const format of commonFormats) {
      const formatDir = path.join(templatesDir, format);
      try {
        if (!fs.existsSync(formatDir)) {
          fs.mkdirSync(formatDir, { recursive: true });
        }
      } catch (err) {
        console.warn(`Warning: Could not create directory for format ${format}:`, err.message);
      }
    }
    
    console.log(`Templates directory initialized at: ${templatesDir}`);
  } catch (err) {
    console.error(`Error initializing templates directory at ${templatesDir}:`, err.message);
    console.error('Please ensure the TEMPLATES_DIR path exists and has write permissions');
    throw err;
  }
}

/**
 * Valide qu'un format de sortie est supporté par Pandoc
 * @param format - Le format à valider
 * @returns true si le format est valide, false sinon
 */
export function validateFormat(format: string): boolean {
  return availableValues.to.includes(format);
}

/**
 * Retourne le chemin complet vers un template
 * @param format - Le format de sortie du template
 * @param name - Le nom du template
 * @returns Le chemin absolu vers le fichier template
 */
export function getTemplatePath(format: string, name: string): string {
  return path.join(templatesDir, format, `${name}.template`);
}

/**
 * Sanitize un nom de fichier pour éviter les path traversal
 * @param name - Le nom à sanitizer
 * @returns Le nom sanitizé
 */
function sanitizeName(name: string): string {
  // Enlever les caractères dangereux et les path traversal
  return name.replace(/[^a-zA-Z0-9\-_]/g, '-').replace(/\.+/g, '-');
}

/**
 * Liste tous les templates disponibles, avec filtrage optionnel par format
 * @param format - Format optionnel pour filtrer les résultats
 * @returns Tableau des informations de templates
 */
export async function listTemplates(format?: string): Promise<TemplateInfo[]> {
  const templates: TemplateInfo[] = [];
  
  // Créer le dossier si nécessaire
  if (!fs.existsSync(templatesDir)) {
    initTemplatesDirectory();
    return templates;
  }
  
  // Si un format est spécifié, ne lister que ce format
  const formats = format ? [format] : await readdir(templatesDir);
  
  for (const fmt of formats) {
    const formatDir = path.join(templatesDir, fmt);
    
    // Vérifier que c'est un dossier
    try {
      const stats = await stat(formatDir);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch (err) {
      // Le dossier n'existe pas, continuer
      continue;
    }
    
    // Lister les fichiers dans le dossier du format
    const files = await readdir(formatDir);
    
    for (const file of files) {
      // Ignorer les fichiers système et cachés
      if (file === '.' || file === '..' || file.startsWith('.')) {
        continue;
      }
      
      const filePath = path.join(formatDir, file);
      const fileStats = await stat(filePath);
      
      // Ignorer les dossiers
      if (fileStats.isDirectory()) {
        continue;
      }
      
      // Extraire le nom sans l'extension
      const name = path.parse(file).name;
      
      templates.push({
        name,
        format: fmt,
        size: fileStats.size,
        createdAt: fileStats.birthtime,
        path: `/templates/${fmt}/${file}`,
      });
    }
  }
  
  return templates;
}

/**
 * Ajoute un nouveau template
 * @param file - Le fichier uploadé (Express.Multer.File)
 * @param format - Le format de sortie du template
 * @param name - Nom personnalisé optionnel pour le template
 * @returns Les informations du template créé
 */
export async function addTemplate(
  file: Express.Multer.File,
  format: string,
  name?: string
): Promise<TemplateInfo> {
  // Valider le format
  if (!validateFormat(format)) {
    throw new ApiError(400, 'invalid_format', `Format '${format}' is not supported`);
  }
  
  // Générer ou sanitizer le nom
  const templateName = name 
    ? sanitizeName(name)
    : sanitizeName(path.parse(file.originalname).name);
  
  // Vérifier que le template n'existe pas déjà
  const templatePath = getTemplatePath(format, templateName);
  if (fs.existsSync(templatePath)) {
    throw new ApiError(
      409,
      'template_already_exists',
      `Template '${templateName}' already exists for format '${format}'`
    );
  }
  
  // Créer le dossier du format si nécessaire
  const formatDir = path.join(templatesDir, format);
  if (!fs.existsSync(formatDir)) {
    await mkdir(formatDir, { recursive: true });
  }
  
  // Copier le fichier uploadé vers le dossier templates
  fs.copyFileSync(file.path, templatePath);
  
  // Récupérer les stats du fichier créé
  const stats = await stat(templatePath);
  
  return {
    name: templateName,
    format,
    size: stats.size,
    createdAt: stats.birthtime,
    path: `/templates/${format}/${templateName}.template`,
  };
}

/**
 * Supprime un template existant
 * @param format - Le format du template
 * @param name - Le nom du template
 */
export async function deleteTemplate(format: string, name: string): Promise<void> {
  const templatePath = getTemplatePath(format, name);
  
  // Vérifier que le template existe
  if (!fs.existsSync(templatePath)) {
    throw new ApiError(
      404,
      'template_not_found',
      `Template '${name}' not found for format '${format}'`
    );
  }
  
  // Supprimer le fichier
  await unlink(templatePath);
}

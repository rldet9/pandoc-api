# Exemples d'Utilisation - Gestion des Templates

## Table des Matières

1. [Exemples cURL](#exemples-curl)
2. [Exemples JavaScript/Node.js](#exemples-javascriptnodejs)
3. [Exemples Python](#exemples-python)
4. [Exemples de Templates Pandoc](#exemples-de-templates-pandoc)
5. [Scénarios d'Usage Complets](#scénarios-dusage-complets)

---

## Exemples cURL

### 1. Lister tous les templates

```bash
# Lister tous les templates
curl http://localhost:4000/api/templates

# Lister les templates HTML uniquement
curl http://localhost:4000/api/templates?format=html

# Lister les templates DOCX uniquement
curl http://localhost:4000/api/templates?format=docx
```

**Réponse attendue** :
```json
{
  "templates": [
    {
      "name": "custom-report",
      "format": "html",
      "size": 2048,
      "createdAt": "2025-11-28T10:30:00.000Z",
      "path": "/templates/html/custom-report.template"
    },
    {
      "name": "corporate",
      "format": "docx",
      "size": 4096,
      "createdAt": "2025-11-27T15:20:00.000Z",
      "path": "/templates/docx/corporate.template"
    },
    {
      "name": "mixtrio",
      "format": "docx",
      "size": 8192,
      "createdAt": "2025-11-28T14:15:00.000Z",
      "path": "/templates/docx/mixtrio.dotx"
    }
  ]
}
```

### 2. Ajouter un template

```bash
# Ajouter un template HTML avec un nom automatique
curl -F file=@my-html-template.html http://localhost:4000/api/templates/html

# Ajouter un template HTML avec un nom personnalisé
curl -F file=@my-html-template.html http://localhost:4000/api/templates/html?name=custom-report

# Ajouter un template DOCX
curl -F file=@corporate-template.docx http://localhost:4000/api/templates/docx?name=corporate

# Ajouter un template DOCX (avec extension .dotx)
curl -F file=@mixtrio.dotx http://localhost:4000/api/templates/docx?name=mixtrio

# Ajouter un template LaTeX
curl -F file=@academic.latex http://localhost:4000/api/templates/latex?name=academic-paper
```

**Réponse attendue (201 Created)** :
```json
{
  "message": "Template added successfully",
  "template": {
    "name": "custom-report",
    "format": "html",
    "size": 2048,
    "createdAt": "2025-11-28T10:30:00.000Z",
    "path": "/templates/html/custom-report.template"
  }
}
```

### 3. Supprimer un template

```bash
# Supprimer un template HTML
curl -X DELETE http://localhost:4000/api/templates/html/custom-report

# Supprimer un template DOCX
curl -X DELETE http://localhost:4000/api/templates/docx/corporate

# Supprimer un template LaTeX
curl -X DELETE http://localhost:4000/api/templates/latex/academic-paper
```

**Réponse attendue (200 OK)** :
```json
{
  "message": "Template deleted successfully",
  "template": {
    "name": "custom-report",
    "format": "html"
  }
}
```

### 4. Gestion des erreurs

```bash
# Erreur 400 - Format invalide
curl -F file=@template.html http://localhost:4000/api/templates/invalid-format
# Réponse : {"status":400,"code":"invalid_format","message":"Format de sortie non supporté"}

# Erreur 400 - Fichier manquant
curl http://localhost:4000/api/templates/html
# Réponse : {"status":400,"code":"invalid_file","message":"Fichier template invalide ou manquant"}

# Erreur 404 - Template non trouvé
curl -X DELETE http://localhost:4000/api/templates/html/non-existent
# Réponse : {"status":404,"code":"template_not_found","message":"Template introuvable"}
```

---

## Exemples JavaScript/Node.js

### 1. Utilisation avec fetch (Node.js 18+)

```javascript
const fs = require('fs');
const FormData = require('form-data');

const API_BASE = 'http://localhost:4000/api';

// Lister les templates
async function listTemplates(format = null) {
  const url = format 
    ? `${API_BASE}/templates?format=${format}` 
    : `${API_BASE}/templates`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.templates;
}

// Ajouter un template
async function addTemplate(filePath, format, name = null) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  
  const url = name 
    ? `${API_BASE}/templates/${format}?name=${name}`
    : `${API_BASE}/templates/${format}`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}

// Supprimer un template
async function deleteTemplate(format, name) {
  const response = await fetch(`${API_BASE}/templates/${format}/${name}`, {
    method: 'DELETE'
  });
  
  return await response.json();
}

// Exemple d'utilisation
(async () => {
  try {
    // Lister les templates HTML
    const htmlTemplates = await listTemplates('html');
    console.log('Templates HTML:', htmlTemplates);
    
    // Ajouter un template
    const newTemplate = await addTemplate(
      './my-template.html', 
      'html', 
      'custom-report'
    );
    console.log('Template ajouté:', newTemplate);
    
    // Supprimer un template
    const result = await deleteTemplate('html', 'custom-report');
    console.log('Template supprimé:', result);
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
```

### 2. Utilisation avec axios

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = 'http://localhost:4000/api';

// Lister les templates
async function listTemplates(format = null) {
  const params = format ? { format } : {};
  const response = await axios.get(`${API_BASE}/templates`, { params });
  return response.data.templates;
}

// Ajouter un template
async function addTemplate(filePath, format, name = null) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  
  const params = name ? { name } : {};
  const response = await axios.post(
    `${API_BASE}/templates/${format}`, 
    formData, 
    {
      params,
      headers: formData.getHeaders()
    }
  );
  
  return response.data;
}

// Supprimer un template
async function deleteTemplate(format, name) {
  const response = await axios.delete(`${API_BASE}/templates/${format}/${name}`);
  return response.data;
}
```

---

## Exemples Python

### Utilisation avec requests

```python
import requests
import json

API_BASE = 'http://localhost:4000/api'

def list_templates(format=None):
    """Liste tous les templates ou filtre par format"""
    params = {'format': format} if format else {}
    response = requests.get(f'{API_BASE}/templates', params=params)
    response.raise_for_status()
    return response.json()['templates']

def add_template(file_path, format, name=None):
    """Ajoute un nouveau template"""
    params = {'name': name} if name else {}
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            f'{API_BASE}/templates/{format}',
            files=files,
            params=params
        )
    
    response.raise_for_status()
    return response.json()

def delete_template(format, name):
    """Supprime un template"""
    response = requests.delete(f'{API_BASE}/templates/{format}/{name}')
    response.raise_for_status()
    return response.json()

# Exemple d'utilisation
if __name__ == '__main__':
    try:
        # Lister les templates HTML
        html_templates = list_templates('html')
        print(f'Templates HTML: {json.dumps(html_templates, indent=2)}')
        
        # Ajouter un template
        new_template = add_template(
            './my-template.html',
            'html',
            'custom-report'
        )
        print(f'Template ajouté: {json.dumps(new_template, indent=2)}')
        
        # Supprimer un template
        result = delete_template('html', 'custom-report')
        print(f'Template supprimé: {json.dumps(result, indent=2)}')
        
    except requests.exceptions.HTTPError as e:
        print(f'Erreur HTTP: {e.response.status_code} - {e.response.text}')
    except Exception as e:
        print(f'Erreur: {str(e)}')
```

---

## Exemples de Templates Pandoc

### 1. Template HTML Simple

```html
<!DOCTYPE html>
<html lang="$lang$">
<head>
  <meta charset="utf-8">
  <title>$if(title)$$title$$endif$</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #007bff;
    }
  </style>
</head>
<body>
  $if(title)$
  <h1>$title$</h1>
  $endif$
  
  $if(author)$
  <p><strong>Auteur:</strong> $author$</p>
  $endif$
  
  $if(date)$
  <p><strong>Date:</strong> $date$</p>
  $endif$
  
  $body$
</body>
</html>
```

**Sauvegarde du template** :
```bash
curl -F file=@custom-report.html http://localhost:4000/api/templates/html?name=custom-report
```

### 2. Template HTML avec CSS Avancé

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$title$</title>
  <style>
    :root {
      --primary-color: #007bff;
      --secondary-color: #6c757d;
      --background-color: #f8f9fa;
    }
    
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      background-color: var(--background-color);
      max-width: 900px;
      margin: 40px auto;
      padding: 40px;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid var(--primary-color);
    }
    
    h1 {
      color: var(--primary-color);
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    
    .metadata {
      color: var(--secondary-color);
      font-style: italic;
    }
    
    h2 {
      color: var(--primary-color);
      border-left: 4px solid var(--primary-color);
      padding-left: 10px;
      margin-top: 30px;
    }
    
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    
    pre {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    
    blockquote {
      border-left: 4px solid var(--secondary-color);
      padding-left: 20px;
      margin-left: 0;
      color: var(--secondary-color);
      font-style: italic;
    }
  </style>
</head>
<body>
  <header>
    $if(title)$<h1>$title$</h1>$endif$
    <div class="metadata">
      $if(author)$<p>Par $author$</p>$endif$
      $if(date)$<p>$date$</p>$endif$
    </div>
  </header>
  
  <main>
    $body$
  </main>
</body>
</html>
```

### 3. Template LaTeX pour Document Académique

```latex
\documentclass[12pt,a4paper]{article}

% Packages
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[french]{babel}
\usepackage{geometry}
\usepackage{fancyhdr}
\usepackage{graphicx}
\usepackage{hyperref}

% Configuration de la page
\geometry{margin=2.5cm}

% En-têtes et pieds de page
\pagestyle{fancy}
\fancyhf{}
\rhead{$title$}
\lhead{$author$}
\cfoot{\thepage}

% Document
\begin{document}

% Page de titre
\begin{titlepage}
  \centering
  \vspace*{2cm}
  
  {\Huge\bfseries $title$ \par}
  \vspace{1cm}
  
  $if(subtitle)$
  {\Large $subtitle$ \par}
  \vspace{1cm}
  $endif$
  
  $if(author)$
  {\large Par \\ \textbf{$author$} \par}
  \vspace{0.5cm}
  $endif$
  
  $if(date)$
  {\large $date$ \par}
  $endif$
  
  \vfill
\end{titlepage}

% Table des matières
$if(toc)$
\tableofcontents
\newpage
$endif$

% Corps du document
$body$

\end{document}
```

**Utilisation** :
```bash
curl -F file=@academic-paper.latex http://localhost:4000/api/templates/latex?name=academic-paper
```

---

## Scénarios d'Usage Complets

### Scénario 1 : Rapports d'Entreprise

```bash
# 1. Créer et uploader le template corporate
curl -F file=@corporate-template.html http://localhost:4000/api/templates/html?name=corporate

# 2. Vérifier que le template est bien enregistré
curl http://localhost:4000/api/templates?format=html

# 3. Utiliser le template pour convertir un document (feature future)
# curl -F file=@report.md http://localhost:4000/api/convert/from/markdown/to/html/template/corporate
```

### Scénario 2 : Documentation Technique

```bash
# 1. Uploader plusieurs templates pour différents formats
curl -F file=@tech-doc.html http://localhost:4000/api/templates/html?name=tech-doc
curl -F file=@tech-doc.latex http://localhost:4000/api/templates/latex?name=tech-doc
curl -F file=@tech-doc.docx http://localhost:4000/api/templates/docx?name=tech-doc

# 2. Lister tous les templates de documentation
curl http://localhost:4000/api/templates

# 3. Mettre à jour un template (supprimer l'ancien et uploader le nouveau)
curl -X DELETE http://localhost:4000/api/templates/html/tech-doc
curl -F file=@tech-doc-v2.html http://localhost:4000/api/templates/html?name=tech-doc
```

### Scénario 3 : Gestion de Templates par Projet

```bash
# Projet A - Templates avec préfixe
curl -F file=@template.html http://localhost:4000/api/templates/html?name=projectA-report
curl -F file=@template.html http://localhost:4000/api/templates/html?name=projectA-invoice

# Projet B - Templates avec préfixe
curl -F file=@template.html http://localhost:4000/api/templates/html?name=projectB-report
curl -F file=@template.html http://localhost:4000/api/templates/html?name=projectB-invoice

# Lister tous les templates HTML (filtrés par projet dans le code client)
curl http://localhost:4000/api/templates?format=html

# Nettoyer les templates du projet A
curl -X DELETE http://localhost:4000/api/templates/html/projectA-report
curl -X DELETE http://localhost:4000/api/templates/html/projectA-invoice
```

### Scénario 4 : Script de Backup

```bash
#!/bin/bash
# backup-templates.sh - Sauvegarder tous les templates

API="http://localhost:4000/api"
BACKUP_DIR="./templates-backup-$(date +%Y%m%d)"

# Créer le dossier de backup
mkdir -p "$BACKUP_DIR"

# Récupérer la liste des templates
TEMPLATES=$(curl -s "$API/templates" | jq -r '.templates[] | "\(.format)/\(.name)"')

# Télécharger chaque template (feature future - GET template content)
echo "$TEMPLATES" | while read template; do
  echo "Backing up: $template"
  # curl -o "$BACKUP_DIR/${template//\//_}.template" "$API/templates/$template"
done

echo "Backup completed in $BACKUP_DIR"
```

### Scénario 5 : Validation et Tests

```bash
# Script de test complet
#!/bin/bash

API="http://localhost:4000/api"
TEST_FILE="test-template.html"

echo "=== Test 1: Liste vide ==="
curl -s "$API/templates" | jq '.'

echo -e "\n=== Test 2: Ajout de template ==="
echo "<html><body>Test</body></html>" > $TEST_FILE
curl -s -F file=@$TEST_FILE "$API/templates/html?name=test" | jq '.'

echo -e "\n=== Test 3: Liste avec template ==="
curl -s "$API/templates" | jq '.'

echo -e "\n=== Test 4: Suppression ==="
curl -s -X DELETE "$API/templates/html/test" | jq '.'

echo -e "\n=== Test 5: Vérification suppression ==="
curl -s "$API/templates" | jq '.'

# Cleanup
rm $TEST_FILE
```

---

## Intégration Future avec Conversions

### Exemple d'utilisation de template dans une conversion (Phase 6)

```bash
# Convertir un document Markdown en HTML avec un template personnalisé
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/html/template/corporate \
  > output.html

# Convertir en PDF avec template LaTeX
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/pdf/template/academic-paper \
  > output.pdf
```

### Code d'intégration JavaScript

```javascript
async function convertWithTemplate(inputFile, fromFormat, toFormat, templateName) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(inputFile));
  
  const response = await fetch(
    `http://localhost:4000/api/convert/from/${fromFormat}/to/${toFormat}/template/${templateName}`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  return await response.buffer();
}

// Utilisation
const pdf = await convertWithTemplate(
  './report.md',
  'markdown',
  'pdf',
  'corporate'
);

fs.writeFileSync('./report.pdf', pdf);
```

---

## Notes Importantes

1. **Formats supportés** : HTML, DOCX, PDF, LaTeX, ODT, EPUB, etc. (tous les formats Pandoc)
2. **Taille limite** : À configurer dans multer (recommandé : 5-10 MB)
3. **Nommage** : Éviter les caractères spéciaux, utiliser des tirets ou underscores
4. **Persistence** : Les templates sont persistés dans le système de fichiers
5. **Sécurité** : Pas d'authentification dans cette version (à ajouter en production)
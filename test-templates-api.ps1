# Script de test PowerShell pour les endpoints de templates

$baseUrl = "http://localhost:4000"
$tempFile = [System.IO.Path]::GetTempFileName()

Write-Host "=== Tests des endpoints de gestion des templates ===" -ForegroundColor Green
Write-Host ""

# Test 1: Liste des templates (devrait être vide au départ)
Write-Host "1. GET /api/templates (liste vide)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates" -Method Get
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Templates trouvés: $($response.templates.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Créer un template HTML de test
Write-Host "2. POST /api/templates/html (ajout d'un template)" -ForegroundColor Yellow
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>`$title`$</title>
</head>
<body>
    `$body`$
</body>
</html>
"@
Set-Content -Path $tempFile -Value $htmlContent -Encoding UTF8

try {
    $form = @{
        file = Get-Item -Path $tempFile
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/html?name=custom-report" -Method Post -Form $form
    Write-Host "   ✓ Status: 201" -ForegroundColor Green
    Write-Host "   Template créé: $($response.template.name)" -ForegroundColor Cyan
    Write-Host "   Format: $($response.template.format)" -ForegroundColor Cyan
    Write-Host "   Taille: $($response.template.size) octets" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Liste des templates (devrait contenir 1 template)
Write-Host "3. GET /api/templates (avec templates)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates" -Method Get
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Templates trouvés: $($response.templates.Count)" -ForegroundColor Cyan
    foreach ($template in $response.templates) {
        Write-Host "   - $($template.name) ($($template.format))" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Filtrage par format
Write-Host "4. GET /api/templates?format=html (filtrage)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates?format=html" -Method Get
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Templates HTML trouvés: $($response.templates.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Créer un template DOCX
Write-Host "5. POST /api/templates/docx (autre format)" -ForegroundColor Yellow
$docxContent = "Template DOCX de test"
Set-Content -Path $tempFile -Value $docxContent -Encoding UTF8

try {
    $form = @{
        file = Get-Item -Path $tempFile
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/docx?name=corporate" -Method Post -Form $form
    Write-Host "   ✓ Status: 201" -ForegroundColor Green
    Write-Host "   Template créé: $($response.template.name)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Liste complète (devrait avoir 2 templates)
Write-Host "6. GET /api/templates (liste complète)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates" -Method Get
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Templates trouvés: $($response.templates.Count)" -ForegroundColor Cyan
    foreach ($template in $response.templates) {
        Write-Host "   - $($template.name) ($($template.format))" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Suppression d'un template
Write-Host "7. DELETE /api/templates/html/custom-report" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/html/custom-report" -Method Delete
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Template supprimé: $($response.template.name)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Vérification après suppression
Write-Host "8. GET /api/templates (après suppression)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates" -Method Get
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
    Write-Host "   Templates restants: $($response.templates.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Erreur - Template inexistant
Write-Host "9. DELETE /api/templates/html/nonexistent (erreur 404)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/html/nonexistent" -Method Delete
    Write-Host "   ✗ Devrait retourner une erreur 404" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 404) {
        Write-Host "   ✓ Status: 404 (attendu)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Erreur inattendue: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 10: Erreur - Format invalide
Write-Host "10. POST /api/templates/invalidformat (erreur 400)" -ForegroundColor Yellow
try {
    $form = @{
        file = Get-Item -Path $tempFile
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/invalidformat" -Method Post -Form $form
    Write-Host "   ✗ Devrait retourner une erreur 400" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Host "   ✓ Status: 400 (attendu)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Erreur inattendue: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 11: Nettoyage - Supprimer le template docx restant
Write-Host "11. DELETE /api/templates/docx/corporate (nettoyage)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/templates/docx/corporate" -Method Delete
    Write-Host "   ✓ Status: 200" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Nettoyage du fichier temporaire
Remove-Item -Path $tempFile -Force

Write-Host "=== Tests terminés ===" -ForegroundColor Green

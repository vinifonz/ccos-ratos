<#
.SYNOPSIS
    Edita uma imagem via Nano Banana 2 (Gemini Image) usando a API direto.

.DESCRIPTION
    Lê GEMINI_API_KEY do .env.local da raiz do workspace, codifica a imagem
    de origem em base64, manda pra Gemini com o prompt (texto ou arquivo) e
    salva o PNG retornado no caminho indicado.

.PARAMETER Image
    Caminho da imagem original a ser editada.

.PARAMETER Prompt
    Texto do prompt OU caminho pra um arquivo de prompt (.txt, .md). Se for
    caminho válido, o conteúdo do arquivo é lido como prompt.

.PARAMETER Output
    Caminho de saída do PNG editado. Pasta é criada se não existir.

.PARAMETER Model
    Modelo Gemini de imagem. Default: gemini-3-pro-image-preview (Nano Banana Pro,
    modelo padrao da Murupi pra imagem). Alternativa mais barata/rapida:
    gemini-3.1-flash-image-preview (Nano Banana 2).

.EXAMPLE
    .\scripts\edit-image-gemini.ps1 `
        -Image "conteudo\prompts-imagem\edits\teste\original.jpg" `
        -Prompt "conteudo\prompts-imagem\edits\teste\prompt.txt" `
        -Output "conteudo\prompts-imagem\edits\teste\editada.png"
#>

param(
    [Parameter(Mandatory=$true)][string]$Image,
    [Parameter(Mandatory=$true)][string]$Prompt,
    [Parameter(Mandatory=$true)][string]$Output,
    [string]$Model = "gemini-3-pro-image-preview"
)

$ErrorActionPreference = "Stop"

# 1. Resolve caminhos (relativos viram absolutos baseados no PWD)
$workspaceRoot = Split-Path $PSScriptRoot -Parent
$Image  = if ([System.IO.Path]::IsPathRooted($Image))  { $Image }  else { Join-Path $workspaceRoot $Image }
$Output = if ([System.IO.Path]::IsPathRooted($Output)) { $Output } else { Join-Path $workspaceRoot $Output }

# 2. Lê GEMINI_API_KEY do .env.local
$envFile = Join-Path $workspaceRoot ".env.local"
if (-not (Test-Path $envFile)) {
    throw ".env.local nao encontrado em $envFile"
}
$keyLine = Get-Content $envFile | Select-String '^GEMINI_API_KEY=' | Select-Object -First 1
if (-not $keyLine) {
    throw "GEMINI_API_KEY nao encontrada no .env.local"
}
$key = $keyLine.ToString().Split('=',2)[1].Trim().Trim('"').Trim("'")

# 3. Codifica imagem em base64 + detecta mime
if (-not (Test-Path $Image)) {
    throw "Imagem original nao encontrada: $Image"
}
$imageBytes = [System.IO.File]::ReadAllBytes($Image)
$imageBase64 = [Convert]::ToBase64String($imageBytes)

$ext = [System.IO.Path]::GetExtension($Image).ToLower()
$mimeType = switch ($ext) {
    ".jpg"  { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png"  { "image/png" }
    ".webp" { "image/webp" }
    ".heic" { "image/heic" }
    default { throw "Extensao nao suportada: $ext (use jpg/png/webp/heic)" }
}

# 4. Le o prompt (inline ou arquivo).
# Cast [string] obrigatorio: sem ele, ConvertTo-Json no PS 5.1 wrappa o conteudo
# como {"value": "..."} dentro de payloads aninhados e a API rejeita com 400.
$promptText = if (Test-Path $Prompt -PathType Leaf) {
    $resolvedPrompt = if ([System.IO.Path]::IsPathRooted($Prompt)) { $Prompt } else { Join-Path $workspaceRoot $Prompt }
    [string](Get-Content $resolvedPrompt -Raw -Encoding utf8)
} else {
    [string]$Prompt
}

if ([string]::IsNullOrWhiteSpace($promptText)) {
    throw "Prompt vazio."
}

# 5. Monta payload (responseModalities exigido pelos modelos de imagem)
$body = @{
    contents = @(@{
        parts = @(
            @{ text = $promptText },
            @{ inlineData = @{ mimeType = $mimeType; data = $imageBase64 } }
        )
    })
    generationConfig = @{
        responseModalities = @("TEXT", "IMAGE")
    }
} | ConvertTo-Json -Depth 10 -Compress

# 6. Chama a API
$uri = "https://generativelanguage.googleapis.com/v1beta/models/${Model}:generateContent"
Write-Host "Chamando $Model..." -ForegroundColor Cyan
Write-Host "Imagem origem: $Image"
Write-Host "Tamanho do prompt: $($promptText.Length) chars"

try {
    $resp = Invoke-RestMethod -Method Post `
        -Uri $uri `
        -Headers @{ "x-goog-api-key" = $key; "Content-Type" = "application/json" } `
        -Body $body `
        -TimeoutSec 180
} catch {
    Write-Host "Erro na chamada da API:" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    } elseif ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
            Write-Host $errorBody
        } catch {
            Write-Host "Sem corpo de erro disponivel."
        }
    }
    throw
}

# 7. Encontra a imagem na resposta
$imagePart = $resp.candidates[0].content.parts | Where-Object { $_.inlineData } | Select-Object -First 1
if (-not $imagePart) {
    Write-Host "Resposta sem imagem. Conteudo retornado:" -ForegroundColor Yellow
    $resp | ConvertTo-Json -Depth 10
    throw "Nenhum inlineData de imagem na resposta."
}

# 8. Decodifica e salva
$outBytes = [Convert]::FromBase64String($imagePart.inlineData.data)
$outDir = Split-Path $Output -Parent
if ($outDir -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}
[System.IO.File]::WriteAllBytes($Output, $outBytes)

$kb = [Math]::Round($outBytes.Length / 1KB, 1)
Write-Host "OK. Imagem editada salva em: $Output ($kb KB)" -ForegroundColor Green

# 9. Se a resposta tiver texto extra, mostra
$textPart = $resp.candidates[0].content.parts | Where-Object { $_.text } | Select-Object -First 1
if ($textPart -and $textPart.text) {
    Write-Host ""
    Write-Host "Texto retornado pelo modelo:" -ForegroundColor DarkGray
    Write-Host $textPart.text -ForegroundColor DarkGray
}

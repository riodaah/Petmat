# Script PowerShell para agregar tags a AWS Amplify App
# Uso: .\add-amplify-tags.ps1 -AppId APP_ID -Region REGION

param(
    [Parameter(Mandatory=$true)]
    [string]$AppId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host "🏷️  Agregando tags a AWS Amplify App: $AppId" -ForegroundColor Cyan
Write-Host "📍 Región: $Region" -ForegroundColor Cyan
Write-Host ""

# Obtener ARN de la app
try {
    $app = aws amplify get-app --app-id $AppId --region $Region --output json | ConvertFrom-Json
    $appArn = $app.app.appArn
    
    if (-not $appArn) {
        Write-Host "❌ Error: No se pudo obtener el ARN de la app" -ForegroundColor Red
        Write-Host "Verifica que el AppId sea correcto y que tengas permisos" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ ARN encontrado: $appArn" -ForegroundColor Green
    Write-Host ""
    
    # Agregar tags
    Write-Host "📝 Agregando tags..." -ForegroundColor Cyan
    
    $tags = @(
        "Key=Project,Value=PetMAT",
        "Key=Environment,Value=Production",
        "Key=Owner,Value=da.morande@gmail.com",
        "Key=CostCenter,Value=Ecommerce",
        "Key=ManagedBy,Value=AWS Amplify"
    )
    
    $tagArgs = @(
        "amplify", "tag-resource",
        "--resource-arn", $appArn,
        "--tags"
    ) + $tags + @("--region", $Region)
    
    & aws $tagArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Tags agregados exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tags configurados:" -ForegroundColor Cyan
        Write-Host "  - Project: PetMAT"
        Write-Host "  - Environment: Production"
        Write-Host "  - Owner: da.morande@gmail.com"
        Write-Host "  - CostCenter: Ecommerce"
        Write-Host "  - ManagedBy: AWS Amplify"
        Write-Host ""
        Write-Host "💡 Los tags aparecerán en Cost Explorer después de 24-48 horas" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "❌ Error al agregar tags" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}



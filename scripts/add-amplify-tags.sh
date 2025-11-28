#!/bin/bash

# Script para agregar tags a AWS Amplify App
# Uso: ./add-amplify-tags.sh APP_ID REGION

APP_ID=$1
REGION=${2:-us-east-1}

if [ -z "$APP_ID" ]; then
  echo "❌ Error: Debes proporcionar el APP_ID"
  echo "Uso: ./add-amplify-tags.sh APP_ID [REGION]"
  echo ""
  echo "Para obtener el APP_ID:"
  echo "  aws amplify list-apps --region $REGION"
  exit 1
fi

echo "🏷️  Agregando tags a AWS Amplify App: $APP_ID"
echo "📍 Región: $REGION"
echo ""

# Obtener ARN de la app
APP_ARN=$(aws amplify get-app \
  --app-id "$APP_ID" \
  --region "$REGION" \
  --query 'app.appArn' \
  --output text 2>/dev/null)

if [ -z "$APP_ARN" ]; then
  echo "❌ Error: No se pudo obtener el ARN de la app"
  echo "Verifica que el APP_ID sea correcto y que tengas permisos"
  exit 1
fi

echo "✅ ARN encontrado: $APP_ARN"
echo ""

# Agregar tags
echo "📝 Agregando tags..."
aws amplify tag-resource \
  --resource-arn "$APP_ARN" \
  --tags \
    Key=Project,Value=PetMAT \
    Key=Environment,Value=Production \
    Key=Owner,Value=da.morande@gmail.com \
    Key=CostCenter,Value=Ecommerce \
    Key=ManagedBy,Value="AWS Amplify" \
  --region "$REGION"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Tags agregados exitosamente!"
  echo ""
  echo "Tags configurados:"
  echo "  - Project: PetMAT"
  echo "  - Environment: Production"
  echo "  - Owner: da.morande@gmail.com"
  echo "  - CostCenter: Ecommerce"
  echo "  - ManagedBy: AWS Amplify"
  echo ""
  echo "💡 Los tags aparecerán en Cost Explorer después de 24-48 horas"
else
  echo ""
  echo "❌ Error al agregar tags"
  exit 1
fi



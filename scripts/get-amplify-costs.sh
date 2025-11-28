#!/bin/bash

# Script para obtener costos de AWS Amplify
# Uso: ./get-amplify-costs.sh [YEAR] [MONTH]

YEAR=${1:-$(date +%Y)}
MONTH=${2:-$(date +%m)}

START_DATE="$YEAR-$MONTH-01"
END_DATE=$(date -d "$START_DATE +1 month" +%Y-%m-%d)

echo "💰 Costos de AWS Amplify"
echo "📅 Período: $START_DATE a $END_DATE"
echo ""

# Obtener costos totales
echo "📊 Costos totales por servicio:"
aws ce get-cost-and-usage \
  --time-period Start=$START_DATE,End=$END_DATE \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --filter file://filter-amplify.json 2>/dev/null || \
aws ce get-cost-and-usage \
  --time-period Start=$START_DATE,End=$END_DATE \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[?Keys[0]==`AWS Amplify`]' \
  --output table

echo ""
echo "🏷️  Costos por tag 'Project':"
aws ce get-cost-and-usage \
  --time-period Start=$START_DATE,End=$END_DATE \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=Project \
  --output table



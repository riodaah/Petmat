# 💰 Guía de Costos y Etiquetado en AWS para PetMAT

## 📊 **Situación Actual**

### **Servicios en Uso:**
- ✅ **AWS Amplify** - Hosting del frontend (React)
- ❌ **NO hay backend** - Las órdenes se guardan en localStorage

### **Costos Estimados:**
- **Tier Gratuito (12 meses):** $0 USD/mes
- **Después del tier gratuito:** ~$5-10 USD/mes

---

## 🔍 **Cómo Ver Costos Actuales**

### **Método 1: AWS Cost Explorer (Recomendado)**

1. **Accede a AWS Console:**
   - Ve a: https://console.aws.amazon.com/
   - Busca "**Cost Management**" o "**Billing**"

2. **Abre Cost Explorer:**
   - Click en **"Cost Explorer"** en el menú lateral
   - Selecciona **"Costs and Usage"**

3. **Filtra por Servicio:**
   - En **"Group by"**, selecciona **"Service"**
   - Busca **"AWS Amplify"**
   - Verás el costo exacto del mes actual

4. **Ver Costos por Etiqueta:**
   - En **"Group by"**, selecciona **"Tag"**
   - Selecciona la etiqueta **"Project"** o **"Environment"**
   - Verás costos agrupados por proyecto

### **Método 2: AWS Billing Dashboard**

1. Ve a: https://console.aws.amazon.com/billing/
2. Click en **"Bills"** para ver facturación detallada
3. Busca **"AWS Amplify"** en la lista de servicios

### **Método 3: AWS CLI**

```bash
# Ver costos del mes actual
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Ver costos filtrados por servicio Amplify
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://filter-amplify.json
```

---

## 🏷️ **Cómo Agregar Tags/Labels a AWS Amplify**

### **¿Por qué etiquetar?**
- ✅ **Tracking de costos** por proyecto
- ✅ **Organización** de recursos
- ✅ **Reportes** más claros
- ✅ **Cumplimiento** de políticas corporativas

### **Tags Recomendados para PetMAT:**

| Tag Key | Tag Value | Descripción |
|---------|-----------|-------------|
| `Project` | `PetMAT` | Nombre del proyecto |
| `Environment` | `Production` | Ambiente (Production/Staging/Dev) |
| `Owner` | `da.morande@gmail.com` | Responsable del proyecto |
| `CostCenter` | `Ecommerce` | Centro de costos |
| `ManagedBy` | `AWS Amplify` | Cómo se gestiona |

### **Método 1: Desde AWS Console (Más Fácil)**

1. **Accede a AWS Amplify Console:**
   - Ve a: https://console.aws.amazon.com/amplify/
   - Selecciona tu app: **petmat-ecommerce** (o el nombre que tenga)

2. **Agregar Tags:**
   - Click en **"App settings"** (configuración de la app)
   - Ve a la sección **"Tags"**
   - Click en **"Manage tags"**
   - Agrega los tags recomendados:
     ```
     Project: PetMAT
     Environment: Production
     Owner: da.morande@gmail.com
     CostCenter: Ecommerce
     ManagedBy: AWS Amplify
     ```
   - Click en **"Save"**

3. **Verificar:**
   - Los tags aparecerán en la sección "Tags"
   - También se verán en Cost Explorer después de 24-48 horas

### **Método 2: Desde AWS CLI**

```bash
# Agregar tags a la app de Amplify
aws amplify tag-resource \
  --resource-arn arn:aws:amplify:us-east-1:ACCOUNT_ID:apps/APP_ID \
  --tags \
    Key=Project,Value=PetMAT \
    Key=Environment,Value=Production \
    Key=Owner,Value=da.morande@gmail.com \
    Key=CostCenter,Value=Ecommerce \
    Key=ManagedBy,Value=AWS\ Amplify

# Obtener ARN de la app primero
aws amplify get-app --app-id APP_ID --region us-east-1
```

### **Método 3: Desde AWS CloudFormation (Si usas IaC)**

Si tienes una plantilla CloudFormation, agrega:

```yaml
Resources:
  AmplifyApp:
    Type: AWS::Amplify::App
    Properties:
      Name: petmat-ecommerce
      Tags:
        - Key: Project
          Value: PetMAT
        - Key: Environment
          Value: Production
        - Key: Owner
          Value: da.morande@gmail.com
        - Key: CostCenter
          Value: Ecommerce
        - Key: ManagedBy
          Value: AWS Amplify
```

---

## 📈 **Monitoreo de Costos**

### **1. Configurar Budgets (Presupuestos)**

1. Ve a: https://console.aws.amazon.com/billing/
2. Click en **"Budgets"** → **"Create budget"**
3. Selecciona **"Cost budget"**
4. Configura:
   - **Budget name:** `PetMAT-Monthly-Budget`
   - **Period:** Monthly
   - **Budget amount:** $15 USD (ajusta según necesites)
   - **Alert threshold:** 80% y 100%
5. **Filtros (opcional):**
   - **Tag:** `Project = PetMAT`
   - **Service:** `AWS Amplify`
6. **Alertas:**
   - Email: `da.morande@gmail.com`
   - Click en **"Create budget"**

### **2. Configurar Cost Anomaly Detection**

1. Ve a: https://console.aws.amazon.com/cost-management/
2. Click en **"Cost Anomaly Detection"**
3. Click en **"Create monitor"**
4. Selecciona **"Service"** y filtra por **"AWS Amplify"**
5. Configura alertas para detectar picos inusuales

### **3. Reportes Personalizados**

1. En **Cost Explorer**, click en **"Reports"**
2. Crea un reporte personalizado:
   - **Name:** `PetMAT-Monthly-Report`
   - **Group by:** `Service`, `Tag:Project`
   - **Schedule:** Monthly
   - **Email:** `da.morande@gmail.com`

---

## 🎯 **Próximos Pasos: Backend Real**

Si quieres migrar a un backend real en AWS, necesitarías:

### **Arquitectura Propuesta:**

```
Frontend (React)
    ↓
AWS Amplify (Hosting)
    ↓
API Gateway
    ↓
Lambda Functions (Backend)
    ↓
DynamoDB (Base de datos)
    ↓
S3 (Archivos/Imágenes)
    ↓
SES (Emails)
```

### **Costos Estimados con Backend:**

| Servicio | Uso Estimado | Costo Mensual |
|----------|--------------|---------------|
| **AWS Amplify** | Hosting frontend | $5-10 USD |
| **API Gateway** | 1M requests/mes | $3.50 USD |
| **Lambda** | 1M requests/mes | $0.20 USD |
| **DynamoDB** | 25 GB storage | $0.63 USD |
| **S3** | 10 GB storage | $0.23 USD |
| **SES** | 1,000 emails/mes | $0.10 USD |
| **TOTAL** | | **~$10-15 USD/mes** |

### **Ventajas de Backend Real:**
- ✅ Órdenes persistentes (no se pierden)
- ✅ Stock real en tiempo real
- ✅ Emails automáticos de confirmación
- ✅ Webhooks de Mercado Pago
- ✅ Panel de admin más robusto
- ✅ Analytics y reportes

---

## 📋 **Checklist de Etiquetado**

- [ ] Acceder a AWS Amplify Console
- [ ] Agregar tags recomendados a la app
- [ ] Verificar tags en la consola
- [ ] Configurar Budget de $15/mes
- [ ] Configurar alertas por email
- [ ] Verificar costos en Cost Explorer (después de 24-48h)
- [ ] Revisar reportes mensuales

---

## 🔗 **Enlaces Útiles**

- **AWS Cost Explorer:** https://console.aws.amazon.com/cost-management/home
- **AWS Amplify Console:** https://console.aws.amazon.com/amplify/
- **AWS Billing Dashboard:** https://console.aws.amazon.com/billing/
- **Documentación de Tags:** https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html

---

**Última actualización:** Enero 2025
**Proyecto:** PetMAT Ecommerce
**Contacto:** da.morande@gmail.com



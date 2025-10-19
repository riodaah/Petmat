# 🚀 Guía de Despliegue en AWS Amplify

## Método 1: Desde la Consola de AWS (Recomendado - Más Visual)

### Paso 1: Acceder a AWS Amplify

1. Inicia sesión en la [Consola de AWS](https://console.aws.amazon.com/)
2. Busca "AWS Amplify" en el buscador de servicios
3. Click en "AWS Amplify"

### Paso 2: Crear Nueva Aplicación

1. Click en **"New app"** → **"Host web app"**
2. Selecciona **"GitHub"** como proveedor
3. Autoriza AWS Amplify a acceder a tu cuenta de GitHub (si aún no lo has hecho)

### Paso 3: Conectar Repositorio

1. Selecciona el repositorio: **riodaah/Petmat**
2. Selecciona la rama: **main**
3. Click en **"Next"**

### Paso 4: Configurar Build Settings

AWS Amplify detectará automáticamente que es un proyecto Vite. La configuración debería verse así:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

✅ Esta configuración ya está incluida en `amplify.yml` en el repositorio.

### Paso 5: Configurar Variables de Entorno (IMPORTANTE)

Antes de continuar, agrega las variables de entorno:

1. En la sección "Advanced settings", expande **"Environment variables"**
2. Agrega las siguientes variables:

| Key | Value | Descripción |
|-----|-------|-------------|
| `VITE_MP_PUBLIC_KEY` | Tu clave pública de MP | Clave pública de Mercado Pago |
| `VITE_MP_ACCESS_TOKEN` | Tu access token de MP | Solo si tienes backend (opcional por ahora) |

**¿Dónde obtener las claves?**
- Visita: https://www.mercadopago.cl/developers/panel/app
- Usa las claves de **TEST** para pruebas
- Usa las claves de **PRODUCCIÓN** para el sitio real

### Paso 6: Nombre de la App

1. Asigna un nombre: **petmat-ecommerce** (o el que prefieras)
2. Click en **"Next"**

### Paso 7: Revisar y Desplegar

1. Revisa la configuración
2. Click en **"Save and deploy"**

🎉 AWS Amplify comenzará a construir y desplegar tu aplicación.

### Paso 8: Esperar el Despliegue

El proceso toma aproximadamente **3-5 minutos** y pasa por estas fases:

1. ✅ **Provision** - Preparando ambiente
2. ✅ **Build** - Instalando dependencias y compilando
3. ✅ **Deploy** - Desplegando a CDN
4. ✅ **Verify** - Verificando despliegue

### Paso 9: Acceder a tu Sitio

Una vez completado, recibirás una URL tipo:

```
https://main.xxxxxxxxx.amplifyapp.com
```

🎊 **¡Tu sitio está en vivo!**

---

## Método 2: Desde AWS CLI

Si prefieres usar la línea de comandos:

### Prerrequisitos

```bash
# Verificar que AWS CLI esté configurado
aws configure list

# Instalar Amplify CLI si no lo tienes
npm install -g @aws-amplify/cli
```

### Crear y Desplegar

```bash
# Inicializar Amplify en el proyecto
amplify init

# Seguir el wizard:
# - Project name: petmat-ecommerce
# - Environment: production
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: dist
# - Build command: npm run build
# - Start command: npm run dev

# Agregar hosting
amplify add hosting

# Seleccionar: Hosting with Amplify Console (Managed hosting)
# Seleccionar: Manual deployment

# Publicar
amplify publish
```

---

## Configuración Post-Despliegue

### 1. Dominio Personalizado (Opcional)

Si quieres usar `petmat.cl`:

1. En AWS Amplify Console, ve a **"Domain management"**
2. Click en **"Add domain"**
3. Sigue el wizard para conectar tu dominio
4. Actualiza los registros DNS según las instrucciones

### 2. Habilitar Ramas de Previsualizaci��n

Para preview automático de PRs:

1. Ve a **"Previews"** en el menú lateral
2. Habilita **"Enable pull request previews"**

### 3. Configurar Notificaciones

1. Ve a **"Notifications"**
2. Configura email para recibir alertas de despliegue

### 4. Configurar Webhooks (Opcional)

Para integrar con Slack, Discord, etc.

---

## Variables de Entorno

### Para Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_MP_PUBLIC_KEY=TEST-tu-clave-publica-aqui
VITE_MP_ACCESS_TOKEN=TEST-tu-access-token-aqui
```

### Para Producción en Amplify

Las variables se configuran en:
**AWS Amplify Console → App settings → Environment variables**

---

## Actualizaciones Automáticas

🔄 **¡AWS Amplify se actualiza automáticamente!**

Cada vez que hagas `git push origin main`, Amplify:

1. Detectará el cambio
2. Construirá automáticamente
3. Desplegará la nueva versión
4. Te enviará notificación

---

## Troubleshooting

### Error: "Build failed"

**Solución:** Revisa los logs en la consola de Amplify. Usualmente es por:
- Falta alguna dependencia en `package.json`
- Variables de entorno mal configuradas
- Error en el código

### El sitio carga pero sin estilos

**Solución:** Verifica que el `baseDirectory` en `amplify.yml` sea `dist` (no `build`)

### Las imágenes no cargan

**Solución:** Las imágenes deben estar en `src/assets/` y ser importadas correctamente en los componentes.

### Mercado Pago no funciona

**Solución:** 
1. Verifica que `VITE_MP_PUBLIC_KEY` esté configurada en las variables de entorno de Amplify
2. Recuerda que el checkout actual está en modo DEMO
3. Para pagos reales, necesitas implementar el backend

---

## Costos de AWS Amplify

### Tier Gratuito (12 meses)

- ✅ 1,000 minutos de build por mes
- ✅ 15 GB de almacenamiento
- ✅ 15 GB de transferencia por mes

### Después del Tier Gratuito

- **Build:** $0.01 por minuto
- **Hosting:** $0.15 por GB servido
- **Almacenamiento:** $0.023 por GB/mes

**Estimado para PetMAT:** ~$5-10 USD/mes con tráfico moderado

---

## Monitoreo y Analytics

### Ver Métricas

1. En AWS Amplify Console
2. Click en tu app
3. Ve a **"Monitoring"**

Verás:
- Requests por minuto
- Latencia
- Errores 4xx/5xx
- Datos transferidos

### Logs

Para ver logs detallados:
1. **"Monitoring"** → **"View logs"**
2. O integra con **CloudWatch** para logs avanzados

---

## Revertir Despliegue

Si algo sale mal:

1. Ve a la lista de despliegues
2. Encuentra la versión anterior que funcionaba
3. Click en **"Redeploy this version"**

---

## Next Steps

### 1. Backend para Mercado Pago

Para pagos reales, necesitas:

- **Lambda function** para crear preferencias de pago
- **API Gateway** como endpoint
- Integración con Mercado Pago SDK desde el backend

### 2. Base de Datos

Si quieres guardar pedidos:

- **DynamoDB** para almacenar órdenes
- **S3** para facturas/recibos
- **SES** para enviar emails de confirmación

### 3. Analytics

- **Google Analytics** o **AWS Pinpoint**
- **Hotjar** para heatmaps
- **Sentry** para tracking de errores

---

## Soporte

- **AWS Amplify Docs:** https://docs.amplify.aws/
- **AWS Support:** Desde la consola de AWS
- **Comunidad:** https://github.com/aws-amplify/amplify-js/discussions

---

## Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] AWS Amplify conectado al repo
- [ ] Variables de entorno configuradas
- [ ] Primer despliegue exitoso
- [ ] Sitio accesible en la URL de Amplify
- [ ] Todas las páginas funcionan correctamente
- [ ] Imágenes cargando correctamente
- [ ] Carrito funciona y persiste
- [ ] Formulario de contacto funciona
- [ ] Responsive en móvil
- [ ] (Opcional) Dominio personalizado configurado
- [ ] (Opcional) SSL/HTTPS activo (Amplify lo hace automático)

---

**¡Listo para producción! 🚀**

Proyecto: **PetMAT Ecommerce**
Repositorio: https://github.com/riodaah/Petmat
Última actualización: Octubre 2025



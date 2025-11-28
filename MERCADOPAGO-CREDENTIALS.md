# 🔐 Credenciales de Mercado Pago en PetMAT

## 📍 **Ubicación Actual de las Credenciales**

### **Están configuradas en AWS Amplify (NO en archivos .env)**

Por seguridad, las credenciales de Mercado Pago **NO están en el código** ni en el repositorio de GitHub. Están almacenadas de forma segura en **AWS Amplify**.

---

## 🔍 **Cómo Ver las Credenciales Configuradas**

### **Método 1: Desde AWS Console (Más Fácil)**

1. **Accede a AWS Amplify Console:**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **Selecciona tu aplicación:**
   - Busca y haz click en tu app (probablemente se llama **"petmat"** o **"petmat-ecommerce"**)

3. **Ve a Environment Variables:**
   - En el menú lateral izquierdo, bajo **"App settings"**
   - Click en **"Environment variables"**

4. **Verás las credenciales:**
   ```
   VITE_MP_PUBLIC_KEY       → Tu Public Key de Mercado Pago
   VITE_MP_ACCESS_TOKEN     → Tu Access Token de Mercado Pago (opcional)
   ```

---

## 🔑 **Tipos de Credenciales de Mercado Pago**

### **1. Public Key (Clave Pública)**
- **Nombre en Amplify:** `VITE_MP_PUBLIC_KEY`
- **Formato:** `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Uso:** Se usa en el frontend para inicializar Mercado Pago
- **Seguridad:** ✅ Seguro exponer en el frontend

### **2. Access Token (Token de Acceso Privado)**
- **Nombre en Amplify:** `VITE_MP_ACCESS_TOKEN`
- **Formato:** `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Uso:** Se usa para crear preferencias de pago (backend)
- **Seguridad:** ⚠️ NO debe exponerse en el frontend
- **Estado actual:** Configurado en Amplify pero **NO se está usando correctamente**

---

## ⚠️ **IMPORTANTE: Problema de Seguridad Actual**

### **El Access Token está expuesto en el frontend**

Actualmente, el `VITE_MP_ACCESS_TOKEN` está configurado en AWS Amplify como variable de entorno con prefijo `VITE_`, lo que significa que **Vite lo incluye en el bundle del frontend**.

```javascript
// En CheckoutMPNew.jsx - ESTO ES INSEGURO
const accessToken = import.meta.env.VITE_MP_ACCESS_TOKEN;
```

### **¿Por qué es un problema?**
- ❌ Cualquiera puede ver el Access Token en el código JavaScript del navegador
- ❌ Podrían crear pagos fraudulentos usando tu cuenta
- ❌ Podrían acceder a información sensible de tu cuenta de Mercado Pago

---

## ✅ **Solución Recomendada: Backend Real**

Para usar el Access Token de forma segura, necesitas un **backend**:

```
Frontend (React)
    ↓
    Solo usa PUBLIC_KEY
    ↓
Backend (Lambda/API)
    ↓
    Usa ACCESS_TOKEN (privado)
    ↓
Mercado Pago API
```

---

## 🛠️ **Cómo Verificar las Credenciales**

### **Desde AWS Console:**

1. Ve a: https://console.aws.amazon.com/amplify/
2. Selecciona tu app
3. Click en **"Environment variables"**
4. Verás algo como:

   ```
   Variable Name              | Value
   ───────────────────────────┼─────────────────────────────────
   VITE_MP_PUBLIC_KEY         | APP_USR-1234567-...
   VITE_MP_ACCESS_TOKEN       | APP_USR-8765432-...
   ```

### **Desde el sitio web (SOLO para Public Key):**

1. Ve a: https://petmat.cl
2. Abre las **DevTools** (F12)
3. Ve a **Console**
4. Escribe:
   ```javascript
   console.log(import.meta.env.VITE_MP_PUBLIC_KEY)
   ```
5. Verás la Public Key (esto es normal y seguro)

---

## 🔄 **Cómo Cambiar las Credenciales**

### **Cambiar de TEST a PRODUCCIÓN:**

1. **Obtén las credenciales de PRODUCCIÓN:**
   - Ve a: https://www.mercadopago.cl/developers/panel/app
   - Selecciona tu aplicación
   - Ve a **"Credenciales"**
   - Copia la **Public Key de PRODUCCIÓN** (no la de TEST)

2. **Actualiza en AWS Amplify:**
   - Ve a: https://console.aws.amazon.com/amplify/
   - Selecciona tu app → **"Environment variables"**
   - Click en **"Manage variables"**
   - **Edita** `VITE_MP_PUBLIC_KEY` y pega la nueva clave
   - Click en **"Save"**

3. **Fuerza un nuevo build:**
   - Ve a la sección **"Deployments"**
   - Click en **"Redeploy this version"**
   - Espera 3-5 minutos

---

## 📋 **Tipos de Credenciales en Mercado Pago**

| Tipo | Formato | Dónde Usar | Exponer en Frontend |
|------|---------|------------|---------------------|
| **Public Key (TEST)** | `TEST-xxxxx` | Frontend (desarrollo) | ✅ Sí |
| **Public Key (PROD)** | `APP_USR-xxxxx` | Frontend (producción) | ✅ Sí |
| **Access Token (TEST)** | `TEST-xxxxx` | Backend (desarrollo) | ❌ No |
| **Access Token (PROD)** | `APP_USR-xxxxx` | Backend (producción) | ❌ No |

---

## 🎯 **Qué Credenciales Usar Según el Ambiente**

### **Desarrollo Local:**
```env
# Archivo .env.local (NO subir a Git)
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### **Producción (petmat.cl):**
```
# En AWS Amplify Environment Variables
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🔒 **Buenas Prácticas de Seguridad**

### ✅ **LO QUE ESTÁ BIEN:**
- Public Key en AWS Amplify con prefijo `VITE_`
- Public Key visible en el frontend
- Public Key en el código fuente

### ❌ **LO QUE ESTÁ MAL (Situación Actual):**
- Access Token en AWS Amplify con prefijo `VITE_`
- Access Token creando preferencias desde el frontend
- Access Token visible en el código JavaScript del navegador

### ✅ **SOLUCIÓN:**
1. **Opción A - Solo Brick (Simple):**
   - Quitar el Access Token de las variables de entorno
   - Usar solo Mercado Pago Brick (sin preferencias)
   - Limita funcionalidades pero es seguro

2. **Opción B - Backend Lambda (Recomendado):**
   - Crear una Lambda Function en AWS
   - Mover el Access Token a Lambda (como secret)
   - Crear preferencias desde Lambda
   - Frontend solo usa Public Key

---

## 📞 **Cómo Obtener las Credenciales de Mercado Pago**

1. **Inicia sesión en Mercado Pago Developers:**
   ```
   https://www.mercadopago.cl/developers/panel
   ```

2. **Ve a tu aplicación:**
   - Click en **"Tus integraciones"**
   - Selecciona tu app o crea una nueva

3. **Obtén las credenciales:**
   - Click en **"Credenciales"** (lado izquierdo)
   - Verás dos secciones:
     - **Credenciales de prueba (TEST):** Para desarrollo
     - **Credenciales de producción (PRODUCCIÓN):** Para el sitio real

4. **Copia las credenciales:**
   - **Public Key:** `TEST-xxxxx` o `APP_USR-xxxxx`
   - **Access Token:** `TEST-xxxxx` o `APP_USR-xxxxx`

---

## 🚀 **Próximos Pasos Recomendados**

### **Para mejorar la seguridad:**

1. **Crear un backend con AWS Lambda**
2. **Mover el Access Token a AWS Secrets Manager**
3. **Crear preferencias de pago desde Lambda**
4. **Configurar webhooks de Mercado Pago**

### **Estimado de tiempo:**
- **Lambda Function:** 1-2 horas
- **Secrets Manager:** 30 minutos
- **API Gateway:** 30 minutos
- **Testing:** 1 hora

### **Costo adicional:**
- **Lambda:** ~$0.20/mes (con Free Tier: $0)
- **Secrets Manager:** $0.40/mes por secret
- **API Gateway:** ~$3.50/mes (con Free Tier: $0)

---

## 📝 **Checklist de Credenciales**

- [ ] Acceder a AWS Amplify Console
- [ ] Verificar que existe `VITE_MP_PUBLIC_KEY`
- [ ] Verificar que la Public Key es de PRODUCCIÓN (no TEST)
- [ ] Considerar quitar `VITE_MP_ACCESS_TOKEN` (inseguro)
- [ ] Considerar implementar backend Lambda
- [ ] Configurar Secrets Manager para Access Token
- [ ] Probar pagos en modo TEST primero
- [ ] Cambiar a PRODUCCIÓN una vez validado

---

**Última actualización:** Enero 2025  
**Proyecto:** PetMAT Ecommerce  
**Contacto:** da.morande@gmail.com



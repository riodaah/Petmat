# 🔄 Migración a Railway - Guía Paso a Paso

Esta guía te ayudará a migrar de forma segura de la implementación actual (Access Token en el frontend) a la nueva arquitectura con backend en Railway.

---

## 📊 **Antes vs Después**

### **❌ ANTES (Inseguro)**

```
Frontend (AWS Amplify)
    ↓
    Usa Access Token (EXPUESTO ❌)
    ↓
API Mercado Pago
```

### **✅ DESPUÉS (Seguro)**

```
Frontend (AWS Amplify)
    ↓
    Solo usa Public Key ✅
    ↓
Backend (Railway)
    ↓
    Usa Access Token (PROTEGIDO ✅)
    ↓
API Mercado Pago
```

---

## 🎯 **Plan de Migración**

### **Fase 1: Preparación** (15 minutos)
- ✅ Backend creado en `petmat-backend/`
- ✅ Componente nuevo `CheckoutMPRailway.jsx` creado
- ✅ Variables de entorno documentadas

### **Fase 2: Deploy Backend** (30 minutos)
1. Subir backend a GitHub
2. Crear proyecto en Railway
3. Agregar PostgreSQL
4. Configurar variables de entorno
5. Verificar que funcione

### **Fase 3: Actualizar Frontend** (15 minutos)
1. Agregar `VITE_BACKEND_URL` en AWS Amplify
2. Ya está usando `CheckoutMPRailway.jsx`
3. Hacer commit y push
4. Esperar deploy de Amplify

### **Fase 4: Testing** (30 minutos)
1. Probar checkout end-to-end
2. Verificar creación de órdenes en PostgreSQL
3. Probar webhooks de Mercado Pago
4. Validar emails de confirmación

### **Fase 5: Limpieza** (10 minutos)
1. Quitar `VITE_MP_ACCESS_TOKEN` de Amplify
2. Archivar componentes viejos
3. Actualizar documentación

---

## 🚀 **Pasos Detallados**

### **Paso 1: Subir Backend a GitHub**

```bash
# Ir a la carpeta del backend
cd C:\Users\damor\Desktop\Petmat.cl\petmat-backend

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial backend setup for PetMAT with Railway"

# Crear repo en GitHub y conectar
# Opción SSH:
git remote add origin git@github.com:riodaah/petmat-backend.git

# O HTTPS si tienes problemas con SSH:
git remote add origin https://github.com/riodaah/petmat-backend.git

# Subir código
git branch -M main
git push -u origin main
```

---

### **Paso 2: Configurar Railway**

#### **2.1. Crear proyecto**

1. Ve a: https://railway.app/
2. Login con GitHub
3. Click en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Selecciona **`petmat-backend`**
6. Click en **"Deploy Now"**

#### **2.2. Agregar PostgreSQL**

1. En tu proyecto, click en **"New"** (botón +)
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Espera que se cree (30 segundos)

#### **2.3. Configurar Variables de Entorno**

1. Click en tu servicio (el código)
2. Ve a **"Variables"**
3. Click en **"Raw Editor"**
4. Pega esto (reemplaza el Access Token):

```env
PORT=3000
MP_ACCESS_TOKEN=APP_USR-tu_access_token_de_mercado_pago
FRONTEND_URL=https://petmat.cl
NODE_ENV=production
```

5. Click en **"Update Variables"**

#### **2.4. Generar Dominio Público**

1. En tu servicio, ve a **"Settings"**
2. Busca **"Networking"**
3. Click en **"Generate Domain"**
4. Copia la URL (algo como: `https://petmat-backend-production.up.railway.app`)

---

### **Paso 3: Verificar Backend**

#### **3.1. Health Check**

Abre en el navegador:

```
https://TU-URL-DE-RAILWAY.up.railway.app/health
```

Deberías ver:

```json
{
  "status": "ok",
  "timestamp": "2025-01-20T...",
  "service": "petmat-backend",
  "version": "1.0.0"
}
```

#### **3.2. Ver Logs**

1. En Railway → Tu servicio → **"Logs"**
2. Deberías ver:
   ```
   🚂 PetMAT Backend running on port 3000
   🗄️  Conectado a PostgreSQL
   ✅ Base de datos inicializada
   ✅ Server ready!
   ```

---

### **Paso 4: Actualizar Frontend**

#### **4.1. Agregar Variable en AWS Amplify**

1. Ve a: https://console.aws.amazon.com/amplify/
2. Selecciona tu app **petmat**
3. Click en **"Environment variables"**
4. Click en **"Manage variables"**
5. Agrega:
   ```
   Key: VITE_BACKEND_URL
   Value: https://TU-URL-DE-RAILWAY.up.railway.app
   ```
6. Click en **"Save"**

#### **4.2. Deploy Frontend**

```bash
# Ir a la carpeta del frontend
cd C:\Users\damor\Desktop\Petmat.cl\petmat-ecommerce

# Ya hemos actualizado App.jsx para usar CheckoutMPRailway
# Solo necesitas hacer commit y push

git add .
git commit -m "Migrate to Railway backend for secure Mercado Pago integration"
git push origin main
```

#### **4.3. Esperar Deploy**

1. Ve a AWS Amplify Console
2. Verás el build en progreso
3. Espera 3-5 minutos
4. Verifica que el status sea "Deployed"

---

### **Paso 5: Probar Todo**

#### **5.1. Probar Checkout**

1. Ve a: https://petmat.cl
2. Agrega productos al carrito
3. Ve a **Checkout**
4. Llena el formulario con datos de prueba:
   ```
   Nombre: Juan Pérez
   Email: test@example.com
   Teléfono: +56912345678
   Dirección: Av. Providencia 123
   Ciudad: Santiago
   Región: Región Metropolitana
   ```
5. Click en **"Pagar con Mercado Pago"**
6. Debería abrirse el checkout de Mercado Pago

#### **5.2. Verificar en Railway**

1. Ve a Railway → Logs
2. Deberías ver:
   ```
   📦 Nueva solicitud de checkout: petmat_...
   ✅ Preferencia creada: 123456789-abc
   ✅ Orden creada en DB: 1
   ```

#### **5.3. Verificar en PostgreSQL**

1. En Railway → PostgreSQL → **"Data"**
2. Deberías ver la tabla `orders`
3. Click para ver los registros
4. Verás tu orden de prueba

---

### **Paso 6: Limpieza y Seguridad**

#### **6.1. Quitar Access Token del Frontend**

1. Ve a AWS Amplify → Environment variables
2. **ELIMINA** la variable `VITE_MP_ACCESS_TOKEN`
3. Click en **"Save"**
4. Fuerza un nuevo deploy

**¿Por qué?** Ya no la necesitas. El backend ahora maneja el Access Token de forma segura.

#### **6.2. Archivar Componentes Viejos**

Los componentes viejos (`CheckoutMP.jsx`, `CheckoutMPNew.jsx`) ya no se usan. Puedes:

**Opción A: Eliminarlos**
```bash
cd petmat-ecommerce
git rm src/components/CheckoutMP.jsx
git rm src/components/CheckoutMPNew.jsx
git commit -m "Remove old insecure checkout components"
git push
```

**Opción B: Moverlos a un backup**
```bash
mkdir src/components/backup
mv src/components/CheckoutMP.jsx src/components/backup/
mv src/components/CheckoutMPNew.jsx src/components/backup/
```

---

## ✅ **Checklist de Migración**

### **Backend (Railway)**
- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] PostgreSQL agregado
- [ ] Variables de entorno configuradas
- [ ] Dominio público generado
- [ ] Health check funciona
- [ ] Logs muestran conexión exitosa

### **Frontend (AWS Amplify)**
- [ ] `VITE_BACKEND_URL` agregada en variables de entorno
- [ ] App.jsx actualizada para usar `CheckoutMPRailway`
- [ ] Código pusheado a GitHub
- [ ] Deploy completado exitosamente
- [ ] `VITE_MP_ACCESS_TOKEN` eliminada (seguridad)

### **Testing**
- [ ] Checkout abre correctamente
- [ ] Mercado Pago se carga sin errores
- [ ] Órdenes se crean en PostgreSQL
- [ ] Logs del backend sin errores
- [ ] CORS funciona correctamente

---

## 🐛 **Troubleshooting Común**

### **Error: "Failed to fetch" en checkout**

**Causa:** El frontend no puede conectarse al backend.

**Solución:**
1. Verifica que `VITE_BACKEND_URL` esté en Amplify
2. Verifica que la URL sea correcta (sin "/" al final)
3. Verifica que Railway esté corriendo (ve a Logs)
4. Verifica CORS en el backend (`FRONTEND_URL=https://petmat.cl`)

### **Error: "CORS blocked"**

**Causa:** El backend no permite requests desde petmat.cl.

**Solución:**
1. Ve a Railway → Variables
2. Verifica que `FRONTEND_URL=https://petmat.cl` (sin "/" al final)
3. Redespliega el servicio

### **Error: "Cannot connect to database"**

**Causa:** PostgreSQL no está conectado.

**Solución:**
1. Verifica que PostgreSQL esté agregado al proyecto
2. Verifica que `DATABASE_URL` esté en variables
3. Reinicia el servicio (Railway → Restart)

### **Error: "Mercado Pago preference creation failed"**

**Causa:** Access Token inválido.

**Solución:**
1. Verifica que `MP_ACCESS_TOKEN` sea el Access Token (no Public Key)
2. Verifica que sea de PRODUCCIÓN (no TEST)
3. Ve a https://www.mercadopago.cl/developers/panel/app y copia nuevamente

---

## 📊 **Monitoreo Post-Migración**

### **Primeras 24 horas**

1. **Revisar Logs en Railway** cada hora
2. **Verificar órdenes en PostgreSQL** 
3. **Probar checkout** desde diferentes dispositivos
4. **Monitorear emails** de error de Railway

### **Primera semana**

1. **Revisar métricas** en Railway (CPU, Memory)
2. **Verificar costos** ($5 gratis debería ser suficiente)
3. **Probar webhooks** de Mercado Pago
4. **Validar emails** de confirmación de compra

---

## 🎉 **¡Migración Completada!**

**Ahora tienes:**

✅ **Backend seguro** en Railway  
✅ **Access Token protegido** (nunca se expone)  
✅ **Base de datos real** (PostgreSQL)  
✅ **Órdenes persistentes** (no se pierden)  
✅ **Webhooks configurados** (notificaciones automáticas)  
✅ **Cumple con políticas de Mercado Pago** 🎯  

**¡Felicitaciones! 🚀**

---

## 📞 **Soporte**

Si tienes problemas:

1. **Revisa los logs:**
   - Railway → Logs (backend)
   - AWS Amplify → Build logs (frontend)
   - Navegador → Console (F12)

2. **Verifica variables:**
   - Railway → Variables
   - AWS Amplify → Environment variables

3. **Contacta:**
   - Railway Discord: https://discord.gg/railway
   - Proyecto: da.morande@gmail.com

---

**Última actualización:** Enero 2025  
**Proyecto:** PetMAT Ecommerce  
**Migración:** Frontend (Amplify) + Backend (Railway)



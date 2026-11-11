# 🐾 PetMAT Ecommerce

Sitio web de ecommerce moderno para PetMAT.cl - Accesorios diseñados para hacer feliz a tu mascota.

## 🚀 Tecnologías

- **React 19** + **Vite** - Framework y build tool
- **TailwindCSS** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación
- **React Markdown** - Renderizado de políticas
- **Mercado Pago** - Procesamiento de pagos

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. **Clonar o navegar al directorio del proyecto:**
   ```bash
   cd petmat-ecommerce
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Copia `.env.example` a `.env` y configura tus claves de Mercado Pago:
   ```bash
   cp .env.example .env
   ```

   Luego edita el archivo `.env`:
   ```env
   VITE_MP_PUBLIC_KEY=tu_clave_publica_de_mercado_pago
   VITE_MP_ACCESS_TOKEN=tu_access_token (solo para backend)
   ```

   > **Nota:** Para obtener tus claves de Mercado Pago, visita: https://www.mercadopago.cl/developers/panel/app

## ▶️ Ejecución en desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:5173`

## 🏗️ Build para producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 👀 Vista previa de producción

```bash
npm run preview
```

## 📁 Estructura del proyecto

```
petmat-ecommerce/
├── src/
│   ├── assets/
│   │   ├── logo-h.png              # Logo horizontal
│   │   ├── logo-square.png         # Logo cuadrado
│   │   ├── products/               # Imágenes de productos
│   │   │   ├── p1/                # Alfombra olfativa
│   │   │   ├── p2/                # Alfombra olfativa circular
│   │   │   └── p3/                # Comedero automático
│   │   └── videos/                # Videos (pendientes de agregar)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductGallery.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CartItem.jsx
│   │   ├── CheckoutMP.jsx
│   │   ├── CTAButton.jsx
│   │   ├── PopupPolicies.jsx
│   │   └── ScrollReveal.jsx
│   ├── data/
│   │   ├── products.json          # Catálogo de productos
│   │   └── policies/              # Políticas en Markdown
│   │       ├── privacy.md
│   │       ├── cookies.md
│   │       ├── terms.md
│   │       └── returns.md
│   ├── hooks/
│   │   └── useCart.js             # Hook del carrito
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Tienda.jsx
│   │   ├── Contacto.jsx
│   │   ├── Success.jsx
│   │   └── Error.jsx
│   ├── utils/
│   │   ├── currency.js            # Formateo CLP
│   │   └── mp.js                  # Helpers Mercado Pago
│   ├── config.json                # Configuración global
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎬 Videos (Pendientes de agregar)

El sitio está preparado para incluir videos en las siguientes ubicaciones:

### src/assets/videos/hero.mp4
- **Resolución:** 1920x1080px
- **Duración:** 6-8 segundos
- **Formato:** MP4
- **Audio:** Sin audio
- **Loop:** Sí
- **Prompt sugerido:** "Perro jugando feliz en living con estética clara y natural, minimal setup"

### src/assets/videos/product-usage-1.mp4
- **Resolución:** 1920x1080px
- **Duración:** 6-8 segundos
- **Formato:** MP4
- **Audio:** Sin audio
- **Prompt sugerido:** "Perro usando alfombra olfativa, plano detalle de la nariz buscando snacks, luz natural"

### src/assets/videos/product-usage-2.mp4
- **Resolución:** 1920x1080px
- **Duración:** 6 segundos
- **Formato:** MP4
- **Audio:** Sin audio
- **Prompt sugerido:** "Primeros planos del material del producto, manos mostrando textura, fondo blanco/soft pastel"

**Para activar los videos:** Descomentar las líneas de video en `src/components/Hero.jsx` una vez que los archivos estén en su lugar.

## 🛒 Funcionalidades

### ✅ Implementadas

- **Catálogo de productos** con 3 productos reales
- **Carrito de compras** con persistencia en localStorage
- **Navegación fluida** con React Router
- **Animaciones** suaves con Framer Motion
- **Responsive design** para móviles, tablets y desktop
- **Galería de imágenes** con zoom
- **Políticas** en modales (Privacidad, Cookies, Términos, Devoluciones)
- **Formulario de contacto**
- **Cálculo de envío** (RM/Regiones)
- **Integración Mercado Pago** (estructura lista)

### 🔄 En desarrollo

- **Backend para Mercado Pago:** Actualmente en modo demo. Para producción, necesitas crear un backend que:
  - Genere las preferencias de pago
  - Gestione webhooks de Mercado Pago
  - Procese confirmaciones de pedido

## 💳 Integración Mercado Pago

### Modo actual (Demo)

El sitio simula el proceso de checkout. Para implementar pagos reales:

1. **Crear un backend** (Node.js, Python, etc.)
2. **Endpoint para crear preferencias:**
   ```javascript
   POST /api/create-preference
   Body: { items: [...], payer: {...}, shipment: {...} }
   Response: { init_point: "url_de_pago_mp" }
   ```
3. **Actualizar `CheckoutMP.jsx`** para llamar a tu endpoint
4. **Implementar webhooks** para recibir notificaciones de pago

Ver documentación: https://www.mercadopago.com.ar/developers/es/docs

## 🎨 Personalización

### Colores

Edita `src/config.json`:
```json
{
  "colors": {
    "primary": "#6CC5E9",
    "text": "#333333",
    "bg": "#FFFFFF",
    "muted": "#F5F5F5"
  }
}
```

### Productos

Edita `src/data/products.json` para agregar, modificar o eliminar productos.

### Envíos

Edita `src/config.json`:
```json
{
  "shipping": {
    "rm": 2990,
    "regions": 3990,
    "prep_days_min": 2,
    "prep_days_max": 5
  }
}
```

## 📧 Contacto

- **Email:** info@petmat.cl
- **Instagram:** [@petmatcl](https://instagram.com/petmatcl)

## 📝 Notas importantes

1. **El ACCESS_TOKEN de Mercado Pago NUNCA debe estar en el frontend.** Solo úsalo en el backend.
2. **Las imágenes de productos** ya están optimizadas y organizadas en `src/assets/products/`
3. **Los videos** necesitan ser generados y colocados en `src/assets/videos/`
4. **Para producción**, configura un backend real para procesar pagos
5. **SEO:** Actualiza las meta tags en `index.html` según necesites

## 🚀 Despliegue

### Opciones recomendadas:

- **Vercel** (recomendado para Vite + React)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Todos soportan builds de Vite automáticamente.

### Variables de entorno en producción:

No olvides configurar `VITE_MP_PUBLIC_KEY` en tu plataforma de hosting.

## 🐛 Troubleshooting

### Las imágenes no cargan
- Verifica que las rutas en `products.json` coincidan con los archivos en `src/assets/products/`
- En desarrollo, las rutas deben empezar con `/src/`

### El carrito no persiste
- Verifica que localStorage esté habilitado en tu navegador
- Revisa la consola por errores de JSON parsing

### Mercado Pago no funciona
- Verifica que `VITE_MP_PUBLIC_KEY` esté configurada en `.env`
- Recuerda que necesitas un backend para crear preferencias reales

## 📄 Licencia

Proyecto desarrollado para PetMAT © 2025

---

**¿Necesitas ayuda?** Abre un issue o contacta al equipo de desarrollo.

## Temporada de Navidad, reseñas y medición

- **Navidad**: `src/config.json` → `season.christmas`. El tema (gorros, regalos, franja verde, textos) se activa entre `start` y `end` y se apaga solo. `lastOrderDateRM` y `lastOrderDateRegions` son las fechas límite que se muestran para recibir antes de Navidad.
- **Descuentos y stock**: salen del backend (`price`, `offerPrice`, `stock`). El "hasta X%" de la franja superior se calcula con esos datos.
- **Reseñas**: las de `src/data/reviews.js` están ocultas (`reviews.showUnverified: false`). Actívalas solo si son de clientes reales.
- **Fotos**: al agregar PNG en `public/assets/products/`, corre `python3 scripts/optimize-images.py` para generar las versiones WebP.
- **Google Analytics / Ads**: define `VITE_GA_ID`, `VITE_GADS_ID` y `VITE_GADS_PURCHASE_LABEL` en el build. Sin ellas no se carga nada. Eventos: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.

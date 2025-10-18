# 🎬 Especificaciones de Videos para PetMAT

Este documento contiene las especificaciones técnicas y prompts sugeridos para generar los videos del sitio web.

## 📍 Ubicación de los archivos

Todos los videos deben colocarse en: `src/assets/videos/`

## 🎥 Videos necesarios

### 1. Video Hero (Principal)

**Archivo:** `hero.mp4`

**Especificaciones técnicas:**
- **Resolución:** 1920x1080px (Full HD)
- **Duración:** 6-8 segundos
- **Formato:** MP4 (H.264)
- **FPS:** 30 o 60
- **Audio:** Sin audio
- **Loop:** Sí (el video debe poder reproducirse en bucle sin cortes)
- **Peso recomendado:** < 5MB (optimizado para web)

**Prompt para IA sugerido:**
```
Perro jugando feliz en un living moderno con estética clara y natural,
minimal setup, luz natural suave, ambiente pet-friendly, mascota activa
y contenta, fondo limpio y ordenado, colores pastel y claros
```

**Dónde se usa:**
- Página de inicio (componente Hero)
- Fondo del banner principal con overlay

**Activación:**
Descomentar las líneas 24-30 en `src/components/Hero.jsx`

---

### 2. Video de Uso del Producto (Alfombra Olfativa)

**Archivo:** `product-usage-1.mp4`

**Especificaciones técnicas:**
- **Resolución:** 1920x1080px (Full HD)
- **Duración:** 6-8 segundos
- **Formato:** MP4 (H.264)
- **FPS:** 30
- **Audio:** Sin audio
- **Peso recomendado:** < 4MB

**Prompt para IA sugerido:**
```
Perro usando alfombra olfativa para snacks, plano detalle de la nariz
del perro buscando premios en la alfombra, luz natural, ambiente cálido,
enfoque en la interacción del perro con el producto, colores naturales
```

**Dónde se usa:**
- Página de inicio (sección de demostración)
- Opcional: página de producto

**Activación:**
Descomentar la sección de video en `src/pages/Home.jsx` (líneas 109-128)

---

### 3. Video de Producto en Detalle

**Archivo:** `product-usage-2.mp4`

**Especificaciones técnicas:**
- **Resolución:** 1920x1080px (Full HD)
- **Duración:** 6 segundos
- **Formato:** MP4 (H.264)
- **FPS:** 30
- **Audio:** Sin audio
- **Peso recomendado:** < 3MB

**Prompt para IA sugerido:**
```
Primeros planos del material de alfombra olfativa para mascotas,
manos humanas mostrando la textura y calidad del producto,
fondo blanco o pastel suave, iluminación profesional de producto,
close-ups de detalles y terminaciones, estilo limpio y minimalista
```

**Dónde se usa:**
- Página de producto individual
- Sección de características

---

## 🛠️ Herramientas recomendadas para generar videos

### Con IA:
1. **Runway ML** - Gen-2 para videos de alta calidad
2. **Pika Labs** - Generación de videos desde texto
3. **Stable Diffusion Video** - Opción open source
4. **Leonardo AI** - Motion para animación de imágenes

### Stock videos (alternativa):
1. **Pexels Videos** - Gratis y de alta calidad
2. **Pixabay Videos** - Amplia biblioteca gratuita
3. **Unsplash Videos** - Curada y profesional

---

## 📝 Checklist de implementación

- [ ] Generar video hero.mp4
- [ ] Generar video product-usage-1.mp4
- [ ] Generar video product-usage-2.mp4
- [ ] Colocar videos en `src/assets/videos/`
- [ ] Descomentar código de video en `Hero.jsx`
- [ ] Descomentar sección de video en `Home.jsx` (opcional)
- [ ] Optimizar videos para web (<5MB cada uno)
- [ ] Verificar que loop funcione correctamente
- [ ] Probar en diferentes navegadores y dispositivos

---

## 🎬 Optimización de videos

### Reducir peso sin perder calidad:

**Con FFmpeg (línea de comandos):**

```bash
# Reducir bitrate manteniendo calidad
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4

# Redimensionar si es necesario
ffmpeg -i input.mp4 -vf scale=1920:1080 output.mp4

# Comprimir aún más para web
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -tune film output.mp4
```

**Con herramientas online:**
- HandBrake (software gratuito)
- CloudConvert.com
- Compressor.io

---

## 💡 Tips para mejores resultados

1. **Iluminación:** Usa luz natural o luz suave para evitar sombras duras
2. **Estabilidad:** Videos estables sin movimientos bruscos
3. **Duración:** Mantén los videos cortos (6-8 segundos) para carga rápida
4. **Loop:** Asegúrate que el inicio y fin del video sean similares para loop perfecto
5. **Marca de agua:** Evita videos con marcas de agua visibles
6. **Compresión:** Optimiza para web sin sacrificar mucha calidad
7. **Testing:** Prueba en móviles y conexiones lentas

---

## 🚨 Notas importantes

- **Sin audio:** Los videos no deben tener audio para mejor experiencia
- **Autoplay:** Los navegadores bloquean autoplay con audio
- **Fallback:** El sitio muestra un gradiente si los videos no están disponibles
- **Lazy loading:** Los videos se cargan de forma optimizada
- **Formato:** MP4 es el más compatible con todos los navegadores

---

## 📞 Soporte

Si tienes dudas sobre la implementación de los videos, revisa:
- `src/components/Hero.jsx` - Implementación del video hero
- `src/pages/Home.jsx` - Sección de video de uso
- README.md - Guía general del proyecto

---

**Proyecto:** PetMAT Ecommerce  
**Última actualización:** Octubre 2025


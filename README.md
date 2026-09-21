# 🌻 Flores Amarillas — 21 de Septiembre (Para Maria Iboni <3)

Una experiencia interactiva y romántica de **Flores Amarillas** desarrollada con **Astro** y optimizada para despliegue gratuito en **Vercel**. Incluye ramo artesanal dinámico, apertura de regalo sorpresa (unboxing), soporte para subir multimedia y audio personalizado, instancias públicas independientes y límite de vigencia de 1 semana.

Repositorio: [https://github.com/DraftraX/21-09.git](https://github.com/DraftraX/21-09.git)

---

## 🌟 Características Principales

1. **🎁 Instancia Pública Pura (0 Botones)**:
   - Ruta: `/regalo/[id]` (ej. `/regalo/maria-iboni`).
   - La persona que recibe el regalo **no ve ningún botón de edición, ni barras de navegación ni publicidad**: únicamente la misteriosa caja de regalo 3D lista para abrir.
2. **🎵 Subida de Audio Propio y Multimedia**:
   - En el taller (`/crear`), puedes subir tu propia canción (MP3, WAV, M4A) o mensaje de voz para que suene automáticamente al abrir la caja, además de subir fotos especiales. Si no subes audio, cuenta con una caja musical de ensueño sintetizada con Web Audio API.
3. **⏳ Duración Máxima de 1 Semana por Regalo**:
   - Cada regalo que se cree es independiente y tiene un temporizador de caducidad estricto de máximo 1 semana (7 días), ideal para la temporada del 21 de septiembre.
   - Tras 1 semana, muestra un emotivo mensaje de ciclo completado preservando el cariño.
4. **🌻 Ramo de Flores Exuberante y Dinámico**:
   - Girasoles dorados radiantes de doble corona de pétalos y centro texturizado, rosas aterciopeladas, tulipanes, margaritas, follaje de eucalipto, paniculata (*Gypsophila*) y envoltura de papel kraft con moño satinado.
   - Brisa constante, flores interactivas que reaccionan al clic rebotando y desprendiendo polen y chispas doradas (`✨`, `💛`, `🌻`).
5. **🐾 Amiguitos Interactivos**:
   - Gatito, Perrito, Conejito, Abejita, Pollito y Capibara con globos de diálogo interactivos.

---

## 🚀 Despliegue Gratuito en Vercel (1 Clic)

1. Sube los cambios a tu repositorio GitHub:
   ```bash
   git add .
   git commit -m "Migración a Astro con Vercel, subida de audio y caducidad de 1 semana"
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **Add New Project** e importa el repositorio `DraftraX/21-09`.
4. Vercel detectará automáticamente que es un proyecto **Astro**. Haz clic en **Deploy**.
5. ¡Listo! Tu aplicación estará activa en internet en pocos segundos con tu dominio `.vercel.app`.

---

## 🌐 Enlaces Principales del Proyecto

- 🎁 **Regalo Público de Maria Iboni <3**: `https://tu-proyecto.vercel.app/regalo/maria-iboni` (o la raíz `/`)
- ✏️ **Taller para Crear Regalos**: `https://tu-proyecto.vercel.app/crear`
- 🔗 **Cada regalo generado**: Tendrá su propia URL independiente con duración de 1 semana (ej. `/regalo/regalo_abc123`).

---

*Hecho con mucho amor para Maria Iboni <3 · 21 de Septiembre*

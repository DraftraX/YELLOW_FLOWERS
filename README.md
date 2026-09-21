# 🌻 Flores Amarillas — 21 de Septiembre (Repositorio Libre Comunitario)

Un proyecto de código abierto y libre desarrollado con **Astro** y optimizado para **Vercel**, diseñado para que **cualquier persona en el mundo pueda crear y regalar un ramo virtual de flores amarillas totalmente gratis** este 21 de septiembre.

Repositorio: [https://github.com/DraftraX/21-09.git](https://github.com/DraftraX/21-09.git)

---

## ✨ ¿Por qué se regalan flores amarillas el 21 de septiembre?

En muchos países de Latinoamérica y el mundo, el 21 de septiembre marca el inicio de la primavera y se ha convertido en una hermosa tradición para regalar **flores amarillas** (inspirado en la canción de *Floricienta*). Representan:
- 💛 **Amor puro y complicidad**: La promesa de estar juntos y compartir la vida.
- ☀️ **Alegría y vitalidad**: Llenar de luz y sonrisas a esa persona especial.
- 🌿 **Comienzo de nuevos ciclos**: Florecer con optimismo y ternura.

---

## 🌟 Características de esta Aplicación Libre

1. **🎁 Instancias Independientes y Gratuitas**:
   - Cada persona puede entrar al taller (`/crear`), escribir el nombre de su ser querido, personalizar la dedicatoria, las razones de amor y los animalitos.
   - Al hacer clic en crear, se genera un **enlace único e independiente** (ej. `/regalo/[id]`) listo para enviar por WhatsApp, Instagram o mensaje.

2. **0️⃣ Vista Pública Pura (0 Botones)**:
   - La persona que recibe el regalo **no ve ningún botón de edición, menú ni publicidad**.
   - Solo ve la misteriosa caja de regalo 3D. Al tocarla, la tapa vuela, brota el ramo dinámico, estalla confeti y comienza la música.

3. **🎵 Subida de Audio Propio y Multimedia**:
   - Puedes subir un archivo de audio propio (MP3, WAV, M4A) o una nota de voz para que suene de fondo.
   - Si no subes audio, incluye una delicada caja musical sintetizada con Web Audio API.
   - Permite subir fotos que se enmarcan con una corona giratoria de girasoles.

4. **🥀 Mecánica de Flores Marchitas y Regadera para Revivir**:
   - Cada regalo tiene una **vigencia de 1 semana** (7 días activos).
   - Si el enlace pasa más de 1 semana inactivo, el ramo se **marchita** (se muestra una escena artística con flores decaídas y mustias en tonos sepia).
   - **¡Pero el cariño nunca muere!**: La pantalla incluye una **regadera mágica interactiva** (🚿). Al hacer clic para **echar agua**, caen gotas de lluvia brillante, los tallos se yerguen, los pétalos recuperan su color amarillo dorado y el regalo se **revive por 1 semana más**.

5. **🌻 Ramo Exuberante y Dinámico**:
   - Girasoles radiantes de doble corona de pétalos, rosas, tulipanes, margaritas, hojas de eucalipto, paniculata (*Gypsophila*) y papel kraft artesanal con moño satinado.
   - Animación de brisa y flores que reaccionan al clic desprendiendo polen y chispas (`✨`, `💛`, `🌻`).

---

## 🚀 Despliegue Gratuito en Vercel (1 Clic)

Cualquiera puede hacer un **Fork** de este repositorio y desplegarlo gratis:

1. Haz un fork o clona este repositorio:
   ```bash
   git clone https://github.com/DraftraX/21-09.git
   ```
2. Inicia sesión en [vercel.com](https://vercel.com/) con tu cuenta de GitHub.
3. Haz clic en **Add New Project** y selecciona `DraftraX/21-09` (o tu fork).
4. Vercel detectará automáticamente el framework **Astro**.
5. Haz clic en **Deploy**. En segundos tu plataforma estará activa con tu propio enlace `.vercel.app`.

---

## 📍 Rutas del Proyecto

- 🎁 **Regalo de Demostración**: `/regalo/demo` (o en la raíz `/`)
- ✏️ **Taller para Crear tu Regalo**: `/crear`
- 🔗 **Cada regalo generado**: `/regalo/[id]` (válido por 1 semana, revivible con agua).

---

*Repositorio libre y abierto para celebrar el amor, la amistad y la primavera este 21 de septiembre 🌻💛*

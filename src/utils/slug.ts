/**
 * Utilidades para generar y extraer slugs limpios y amigables para los enlaces de regalo.
 * Permite que los enlaces lleven el nombre de la persona (ej. /regalo/valentina-4d1nqh)
 */

/**
 * Convierte un nombre o texto en un slug apto para URL.
 * Ejemplos:
 *  - "María Iboni <3" -> "maria-iboni"
 *  - "¡Mamá Querida!" -> "mama-querida"
 *  - "Sofía 💛 ✨" -> "sofia"
 */
export function cleanNameSlug(name: string): string {
  if (!name) return 'regalo';

  let clean = name
    // Reemplazar patrones comunes de emoticonos como <3
    .replace(/<+3+/g, '')
    // Descomponer caracteres con acentos/diacríticos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // Permitir solo letras a-z, números y espacios
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    // Reemplazar secuencias de espacios o guiones múltiples por un solo guion
    .replace(/[\s-]+/g, '-');

  // Limitar longitud para mantener URLs limpias y legibles
  if (clean.length > 32) {
    clean = clean.substring(0, 32).replace(/-$/, '');
  }

  return clean || 'regalo';
}

/**
 * Genera el identificador único compuesto con el nombre del destinatario y la clave permanente.
 * Ejemplo: createGiftId("Sofía", "k1m8n3") -> "sofia-k1m8n3"
 */
export function createGiftId(recipient: string, storageKey?: string): string {
  const base = cleanNameSlug(recipient);
  if (!storageKey) return base;
  return `${base}-${storageKey}`;
}

/**
 * Extrae la clave de almacenamiento permanente (Catbox / CDN) a partir de un ID.
 * Admite:
 *  - "sofia-4d1nqh" -> "4d1nqh"
 *  - "maria_iboni_4d1nqh" -> "4d1nqh"
 *  - "4d1nqh" -> "4d1nqh"
 */
export function extractStorageKey(id: string): string | null {
  if (!id) return null;
  const trimmed = id.trim();

  // Si es directamente una clave de 6 caracteres alfanuméricos
  if (/^[a-z0-9]{6}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  // Si termina en guion o guion bajo seguido de 6 caracteres alfanuméricos
  const match = trimmed.match(/[-_]([a-z0-9]{6})$/i);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }

  return null;
}

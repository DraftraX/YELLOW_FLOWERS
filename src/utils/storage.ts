import { DEFAULT_GIFT, type GiftData, ONE_WEEK_MS } from './defaults';
import { dbSaveGift, dbGetGift, dbReviveGift } from './database';

// Almacén en memoria global para el proceso serverless
const memoryStore = new Map<string, GiftData>();

// Inicializar el regalo predeterminado
memoryStore.set(DEFAULT_GIFT.id, {
  ...DEFAULT_GIFT,
  createdAt: Date.now(),
  expiresAt: Date.now() + ONE_WEEK_MS
});

/**
 * Codifica un objeto GiftData en un token seguro para URL
 */
export function encodeGiftToken(data: GiftData): string {
  try {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error("Error codificando token de regalo:", e);
    return "";
  }
}

/**
 * Decodifica un token URL a un objeto GiftData
 */
export function decodeGiftToken(token: string): GiftData | null {
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    return { ...DEFAULT_GIFT, ...parsed };
  } catch (e) {
    console.warn("No se pudo decodificar token:", e);
    return null;
  }
}

/**
 * Guarda un regalo con duración máxima estricta de 1 semana en SQLite y memoria
 */
export function saveGift(data: Partial<GiftData>): { gift: GiftData; token: string } {
  const now = Date.now();
  const id = data.id || `regalo_${Math.random().toString(36).substring(2, 9)}`;
  
  // Límite estricto: máximo 1 semana (7 días)
  const createdAt = data.createdAt || now;
  const maxExpiresAt = createdAt + ONE_WEEK_MS;
  const expiresAt = data.expiresAt ? Math.min(data.expiresAt, maxExpiresAt) : maxExpiresAt;

  const fullGift: GiftData = {
    ...DEFAULT_GIFT,
    ...data,
    id,
    createdAt,
    expiresAt
  };

  // 1. Guardar en SQLite
  dbSaveGift(fullGift);

  // 2. Guardar en memoria
  memoryStore.set(id, fullGift);

  // 3. Generar token de respaldo
  const token = encodeGiftToken(fullGift);

  return { gift: fullGift, token };
}

/**
 * Obtiene un regalo por su ID o token (consulta SQLite -> Memoria -> Token)
 */
export function getGift(idOrToken: string): { gift: GiftData | null; isExpired: boolean; remainingText: string } {
  let gift: GiftData | null = null;

  // Caso especial: modelo demo / especial
  if (idOrToken === 'especial' || idOrToken === 'demo' || idOrToken === 'default' || idOrToken === 'maria-iboni') {
    gift = {
      ...DEFAULT_GIFT,
      expiresAt: Date.now() + ONE_WEEK_MS
    };
  } else {
    // 1. Intentar consultar SQLite
    gift = dbGetGift(idOrToken);

    // 2. Si no está en SQLite, buscar en memoria
    if (!gift && memoryStore.has(idOrToken)) {
      gift = memoryStore.get(idOrToken)!;
    }

    // 3. Si no, intentar decodificar como token autónomo
    if (!gift) {
      gift = decodeGiftToken(idOrToken);
      if (gift) {
        // Restaurar en SQLite y memoria
        dbSaveGift(gift);
        memoryStore.set(gift.id, gift);
      }
    }
  }

  if (!gift) {
    return { gift: null, isExpired: false, remainingText: "" };
  }

  // Comprobar expiración estricta de 1 semana
  const now = Date.now();
  const isExpired = now > gift.expiresAt;

  let remainingText = "";
  if (!isExpired) {
    const diffMs = gift.expiresAt - now;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (diffDays > 0) {
      remainingText = `Válido por ${diffDays} día${diffDays > 1 ? 's' : ''} y ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
      remainingText = `Válido por ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    }
  } else {
    remainingText = "Este ramo se ha marchitado (más de 1 semana inactivo)";
  }

  return { gift, isExpired, remainingText };
}

/**
 * Revive un regalo marchitado: añade 1 semana adicional y actualiza en SQLite y memoria
 */
export function reviveGift(idOrToken: string): { gift: GiftData; token: string } {
  const { gift } = getGift(idOrToken);
  const targetGift = gift || DEFAULT_GIFT;
  
  const revived: GiftData = {
    ...targetGift,
    createdAt: Date.now(),
    expiresAt: Date.now() + ONE_WEEK_MS
  };

  // Guardar en SQLite y memoria
  dbSaveGift(revived);
  memoryStore.set(revived.id, revived);

  const token = encodeGiftToken(revived);

  return { gift: revived, token };
}

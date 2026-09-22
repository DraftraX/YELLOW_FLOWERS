import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as zlib from 'node:zlib';
import { DEFAULT_GIFT, type GiftData, ONE_WEEK_MS } from './defaults';
import { dbSaveGift, dbGetGift, dbReviveGift } from './database';
import { cleanNameSlug, createGiftId, extractStorageKey } from './slug';

// Directorio de copias de seguridad de regalos en JSON
const JSON_BACKUP_DIR = process.env.VERCEL
  ? path.join('/tmp', 'regalos')
  : path.join(process.cwd(), 'data', 'regalos');

if (!fs.existsSync(JSON_BACKUP_DIR)) {
  try {
    fs.mkdirSync(JSON_BACKUP_DIR, { recursive: true });
  } catch (e) {}
}

// Almacén en memoria global para el proceso
const memoryStore = new Map<string, GiftData>();

// Inicializar el regalo predeterminado
memoryStore.set(DEFAULT_GIFT.id, {
  ...DEFAULT_GIFT,
  createdAt: Date.now(),
  expiresAt: Date.now() + ONE_WEEK_MS
});

/**
 * Codifica un objeto GiftData en un token comprimido ultra ligero y seguro para URL.
 * Utiliza zlib.deflateRaw + base64url para reducir el tamaño en ~70%
 */
export function encodeGiftToken(data: GiftData): string {
  try {
    const json = JSON.stringify(data);
    const deflated = zlib.deflateRawSync(Buffer.from(json, 'utf-8'));
    return deflated.toString('base64url');
  } catch (e) {
    try {
      // Fallback a base64 estándar
      const json = JSON.stringify(data);
      return Buffer.from(json, 'utf-8').toString('base64url');
    } catch (err) {
      console.error("Error codificando token de regalo:", err);
      return "";
    }
  }
}

/**
 * Decodifica un token URL a un objeto GiftData.
 * Admite tanto el nuevo formato comprimido con zlib como el formato base64 anterior.
 */
export function decodeGiftToken(token: string): GiftData | null {
  if (!token) return null;
  const trimmed = token.trim();

  // 1. Intentar descompresión con zlib.inflateRaw (nuevo formato ultra ligero)
  try {
    const inflated = zlib.inflateRawSync(Buffer.from(trimmed, 'base64url')).toString('utf-8');
    const parsed = JSON.parse(inflated);
    if (parsed && typeof parsed === 'object') {
      return { ...DEFAULT_GIFT, ...parsed };
    }
  } catch (e) {}

  // 2. Intentar decodificación directa base64url / base64 (compatibilidad con enlaces previos)
  try {
    let base64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object') {
      return { ...DEFAULT_GIFT, ...parsed };
    }
  } catch (e) {}

  return null;
}

/**
 * Guarda el regalo de forma permanente en la nube para garantizar persistencia en Vercel Serverless.
 * Capa 1: Catbox CDN (permanente, zero-config, gratuito).
 * Capa 2: Upstash Redis / Vercel KV (si las variables de entorno están configuradas).
 */
export async function saveToCloud(gift: GiftData): Promise<string | null> {
  let cloudKey: string | null = null;

  // 1. Catbox CDN (Zero-Config)
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    const jsonBlob = new Blob([JSON.stringify(gift)], { type: 'application/json' });
    const fileName = `${cleanNameSlug(gift.recipient)}.json`;
    form.append('fileToUpload', jsonBlob, fileName);

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
      headers: { 'User-Agent': 'FloresAmarillas/2.0' }
    });

    if (res.ok) {
      const urlText = (await res.text()).trim();
      if (urlText.startsWith('https://files.catbox.moe/')) {
        const filePart = urlText.split('/').pop() || '';
        cloudKey = filePart.replace('.json', '');
        console.log(`[Storage] Regalo guardado permanentemente en Catbox CDN: ${urlText} (Key: ${cloudKey})`);
      }
    }
  } catch (catboxErr) {
    console.warn("[Storage] Catbox CDN no disponible temporalmente:", catboxErr);
  }

  // 2. Redis / Vercel KV si existen variables de entorno
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      await fetch(`${redisUrl}/set/${encodeURIComponent(gift.id)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${redisToken}` },
        body: JSON.stringify(gift)
      });
      console.log(`[Storage] Regalo respaldado en Redis/KV: ${gift.id}`);
    } catch (redisErr) {
      console.warn("[Storage] Error guardando en Redis/KV:", redisErr);
    }
  }

  return cloudKey;
}

/**
 * Recupera un regalo de la nube (Catbox CDN o Redis KV)
 */
export async function fetchFromCloud(idOrKey: string): Promise<GiftData | null> {
  if (!idOrKey) return null;

  // 1. Consultar Redis / Vercel KV si está disponible
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/${encodeURIComponent(idOrKey)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          return { ...DEFAULT_GIFT, ...parsed };
        }
      }
    } catch (e) {}
  }

  // 2. Extraer clave de Catbox y consultar CDN
  const catboxKey = extractStorageKey(idOrKey);
  if (catboxKey) {
    try {
      const res = await fetch(`https://files.catbox.moe/${catboxKey}.json`, {
        headers: { 'User-Agent': 'FloresAmarillas/2.0' }
      });
      if (res.ok) {
        const parsed = await res.json();
        if (parsed && typeof parsed === 'object' && parsed.recipient) {
          return { ...DEFAULT_GIFT, ...parsed };
        }
      }
    } catch (e) {
      console.warn(`[Storage] No se pudo recuperar de Catbox (${catboxKey}):`, e);
    }
  }

  return null;
}

/**
 * Guarda un regalo con enlace personalizado que incluye el nombre de la persona
 * y garantiza persistencia de 7 días.
 */
export async function saveGift(data: Partial<GiftData>): Promise<{ gift: GiftData; token: string }> {
  const now = Date.now();
  const recipient = (data.recipient || 'Alguien Especial').trim();
  const baseSlug = cleanNameSlug(recipient);

  // Límite estricto: máximo 1 semana (7 días)
  const createdAt = data.createdAt || now;
  const maxExpiresAt = createdAt + ONE_WEEK_MS;
  const expiresAt = data.expiresAt ? Math.min(data.expiresAt, maxExpiresAt) : maxExpiresAt;

  // Si ya venía con ID predeterminado, respetarlo; de lo contrario creamos ID temporal
  const tempId = data.id || baseSlug;

  const tempGift: GiftData = {
    ...DEFAULT_GIFT,
    ...data,
    id: tempId,
    recipient,
    createdAt,
    expiresAt
  };

  // 1. Guardar de forma permanente en la nube (Catbox CDN / KV)
  let cloudKey: string | null = null;
  try {
    cloudKey = await saveToCloud(tempGift);
  } catch (err) {
    console.warn("Fallo subida a nube en saveGift:", err);
  }

  // Construir el identificador único final con el nombre de la persona y la clave permanente
  // Ejemplo: "maria-iboni-4d1nqh"
  const finalKey = cloudKey || crypto.randomUUID().slice(0, 6);
  const finalId = data.id || createGiftId(recipient, finalKey);

  const fullGift: GiftData = {
    ...tempGift,
    id: finalId
  };

  // Si el ID cambió con el identificador único, actualizar el registro en la nube
  if (cloudKey && fullGift.id !== tempGift.id) {
    saveToCloud(fullGift).catch(() => {});
  }

  // 2. Guardar en SQLite local
  dbSaveGift(fullGift);

  // 3. Guardar archivo JSON de respaldo local
  try {
    const backupFile = path.join(JSON_BACKUP_DIR, `${fullGift.id}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(fullGift), 'utf-8');
  } catch (err) {}

  // 4. Guardar en memoria
  memoryStore.set(fullGift.id, fullGift);

  // 5. Generar token autónomo comprimido para fallback en URL (?d=...)
  const token = encodeGiftToken(fullGift);

  return { gift: fullGift, token };
}

/**
 * Obtiene un regalo por su ID o token (Memoria -> SQLite -> Nube Catbox/KV -> Token de respaldo)
 * Garantiza que aunque Vercel se reinicie, el regalo se recupere intacto.
 */
export async function getGift(
  idOrToken: string,
  fallbackToken?: string
): Promise<{ gift: GiftData | null; isExpired: boolean; remainingText: string }> {
  let gift: GiftData | null = null;

  // Caso especial: demostración o regalo por defecto
  if (idOrToken === 'especial' || idOrToken === 'demo' || idOrToken === 'default' || idOrToken === 'maria-iboni') {
    gift = {
      ...DEFAULT_GIFT,
      expiresAt: Date.now() + ONE_WEEK_MS
    };
  } else {
    // 1. Buscar en memoria del proceso actual
    if (memoryStore.has(idOrToken)) {
      gift = memoryStore.get(idOrToken)!;
    }

    // 2. Buscar en SQLite local
    if (!gift) {
      gift = dbGetGift(idOrToken);
    }

    // 3. Buscar en archivo JSON de respaldo local
    if (!gift) {
      try {
        const backupFile = path.join(JSON_BACKUP_DIR, `${idOrToken}.json`);
        if (fs.existsSync(backupFile)) {
          const content = fs.readFileSync(backupFile, 'utf-8');
          gift = JSON.parse(content);
        }
      } catch (e) {}
    }

    // 4. Si la instancia de Vercel es nueva (Cold Start), recuperar de la nube permanente
    if (!gift) {
      gift = await fetchFromCloud(idOrToken);
    }

    // 5. Si no se encontró en la nube, probar con el token de respaldo en parámetro (?d=...)
    if (!gift && fallbackToken) {
      gift = decodeGiftToken(fallbackToken);
    }

    // 6. Probar si el propio ID es un token comprimido
    if (!gift) {
      gift = decodeGiftToken(idOrToken);
    }
  }

  if (!gift) {
    return { gift: null, isExpired: false, remainingText: "" };
  }

  // Sincronizar en caché local y SQLite para que las siguientes peticiones sean instantáneas
  try {
    dbSaveGift(gift);
    memoryStore.set(gift.id, gift);
    if (idOrToken !== gift.id) {
      memoryStore.set(idOrToken, gift);
    }
  } catch (e) {}

  // Comprobar expiración estricta de 1 semana (7 días)
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
 * Revive un regalo marchitado: añade 1 semana adicional y actualiza en la nube, SQLite y memoria
 */
export async function reviveGift(idOrToken: string, token?: string): Promise<{ gift: GiftData; token: string }> {
  const { gift: existing } = await getGift(idOrToken, token);
  const targetGift = existing || DEFAULT_GIFT;

  const revived: GiftData = {
    ...targetGift,
    createdAt: Date.now(),
    expiresAt: Date.now() + ONE_WEEK_MS
  };

  // 1. Guardar de nuevo en la nube permanente
  await saveToCloud(revived).catch(() => {});

  // 2. Guardar en SQLite, JSON de respaldo y memoria local
  dbSaveGift(revived);
  try {
    const backupFile = path.join(JSON_BACKUP_DIR, `${revived.id}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(revived), 'utf-8');
  } catch (e) {}

  memoryStore.set(revived.id, revived);

  const newToken = encodeGiftToken(revived);
  return { gift: revived, token: newToken };
}

import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DEFAULT_GIFT, type GiftData, ONE_WEEK_MS } from './defaults';
import { dbSaveGift, dbGetGift, dbReviveGift } from './database';

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
 * Codifica un objeto GiftData en un token seguro para URL (compatibilidad histórica)
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
 * Decodifica un token URL a un objeto GiftData (compatibilidad histórica)
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
 * Guarda un regalo con duración máxima de 1 semana usando UUID estándar o corto
 */
export function saveGift(data: Partial<GiftData>): { gift: GiftData; token: string } {
  const now = Date.now();
  // Generar UUID único y limpio
  const id = data.id || crypto.randomUUID();
  
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

  // 2. Guardar archivo JSON de respaldo
  try {
    const backupFile = path.join(JSON_BACKUP_DIR, `${id}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(fullGift), 'utf-8');
  } catch (err) {
    console.warn("No se pudo guardar backup JSON:", err);
  }

  // 3. Guardar en memoria
  memoryStore.set(id, fullGift);

  // 4. Token de respaldo (por si fuera necesario)
  const token = encodeGiftToken(fullGift);

  return { gift: fullGift, token };
}

/**
 * Obtiene un regalo por su ID o token (consulta SQLite -> Backup JSON -> Memoria -> Token)
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

    // 2. Si no está en SQLite, buscar en archivos JSON de respaldo
    if (!gift) {
      try {
        const backupFile = path.join(JSON_BACKUP_DIR, `${idOrToken}.json`);
        if (fs.existsSync(backupFile)) {
          const content = fs.readFileSync(backupFile, 'utf-8');
          gift = JSON.parse(content);
          if (gift) {
            dbSaveGift(gift);
            memoryStore.set(gift.id, gift);
          }
        }
      } catch (e) {}
    }

    // 3. Si no está en disco, buscar en memoria
    if (!gift && memoryStore.has(idOrToken)) {
      gift = memoryStore.get(idOrToken)!;
    }

    // 4. Si no, intentar decodificar como token autónomo (enlaces antiguos con ?d=...)
    if (!gift) {
      gift = decodeGiftToken(idOrToken);
      if (gift) {
        dbSaveGift(gift);
        memoryStore.set(gift.id, gift);
      }
    }
  }

  if (!gift) {
    return { gift: null, isExpired: false, remainingText: "" };
  }

  // Comprobar expiración estricta de 1 semana (7 días)
  const now = Date.now();
  const isExpired = now > gift.expiresAt;

  // Si pasaron 7 días y no se reactivó, purgar fotos, audio y multimedia para ahorrar espacio
  if (isExpired && (gift.photoUrl || gift.audioUrl)) {
    try {
      if (gift.photoUrl && gift.photoUrl.startsWith('/uploads/')) {
        const fileName = path.basename(gift.photoUrl);
        const dirs = [
          process.env.VERCEL ? path.join('/tmp', 'uploads', fileName) : '',
          path.join(process.cwd(), 'public', 'uploads', fileName)
        ].filter(Boolean);

        for (const p of dirs) {
          if (fs.existsSync(p)) {
            try { fs.unlinkSync(p); } catch (e) {}
          }
        }
      }
      // Limpiar campos pesados
      gift.photoUrl = '';
      gift.audioUrl = '';
      dbSaveGift(gift);
      memoryStore.set(gift.id, gift);
      
      const backupFile = path.join(JSON_BACKUP_DIR, `${gift.id}.json`);
      if (fs.existsSync(backupFile)) {
        try { fs.writeFileSync(backupFile, JSON.stringify(gift), 'utf-8'); } catch (e) {}
      }
    } catch (purgeErr) {
      console.warn("Error purgando multimedia expirada:", purgeErr);
    }
  }

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

  // Guardar en SQLite, JSON de respaldo y memoria
  dbSaveGift(revived);
  try {
    const backupFile = path.join(JSON_BACKUP_DIR, `${revived.id}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(revived), 'utf-8');
  } catch (e) {}

  memoryStore.set(revived.id, revived);

  const token = encodeGiftToken(revived);

  return { gift: revived, token };
}


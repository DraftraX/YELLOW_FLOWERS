import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GiftData } from './defaults';
import { DEFAULT_GIFT, ONE_WEEK_MS } from './defaults';

// Determinar ruta de almacenamiento de SQLite:
// En Vercel Serverless, solo /tmp es escribible. En local, usamos ./data/flores.sqlite
const DB_DIR = process.env.VERCEL 
  ? '/tmp' 
  : path.join(process.cwd(), 'data');

if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (e) {
    console.warn("No se pudo crear directorio de base de datos:", e);
  }
}

const DB_PATH = path.join(DB_DIR, 'flores.sqlite');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initDatabaseSchema(dbInstance);
  }
  return dbInstance;
}

function initDatabaseSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS regalos (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      recipient TEXT NOT NULL,
      sender_tag TEXT,
      header_title TEXT,
      header_subtitle TEXT,
      box_tag TEXT,
      box_subtitle TEXT,
      letter_title TEXT,
      letter_body TEXT,
      letter_sign TEXT,
      photo_url TEXT,
      photo_title TEXT,
      photo_subtitle TEXT,
      theme TEXT,
      bouquet_style TEXT,
      audio_url TEXT,
      audio_name TEXT,
      notes_json TEXT,
      animals_json TEXT
    );
  `);
}

/**
 * Guarda o actualiza un regalo en SQLite
 */
export function dbSaveGift(gift: GiftData): void {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO regalos (
        id, created_at, expires_at, recipient, sender_tag,
        header_title, header_subtitle, box_tag, box_subtitle,
        letter_title, letter_body, letter_sign, photo_url,
        photo_title, photo_subtitle, theme, bouquet_style,
        audio_url, audio_name, notes_json, animals_json
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    stmt.run(
      gift.id,
      gift.createdAt,
      gift.expiresAt,
      gift.recipient,
      gift.senderTag || '',
      gift.headerTitle || '',
      gift.headerSubtitle || '',
      gift.boxTag || '',
      gift.boxSubtitle || '',
      gift.letterTitle || '',
      gift.letterBody || '',
      gift.letterSign || '',
      gift.photoUrl || '',
      gift.photoTitle || '',
      gift.photoSubtitle || '',
      gift.theme || 'clasico',
      gift.bouquetStyle || 'exuberante',
      gift.audioUrl || '',
      gift.audioName || '',
      JSON.stringify(gift.notes || []),
      JSON.stringify(gift.animals || [])
    );
  } catch (e) {
    console.error("Error guardando regalo en SQLite:", e);
  }
}

/**
 * Consulta un regalo de SQLite por su ID
 */
export function dbGetGift(id: string): GiftData | null {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`SELECT * FROM regalos WHERE id = ?`);
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      createdAt: Number(row.created_at),
      expiresAt: Number(row.expires_at),
      recipient: row.recipient,
      senderTag: row.sender_tag,
      headerPill: "21 · DE · SEPTIEMBRE",
      headerTitle: row.header_title,
      headerSubtitle: row.header_subtitle,
      boxTag: row.box_tag,
      boxSubtitle: row.box_subtitle,
      letterTitle: row.letter_title,
      letterBody: row.letter_body,
      letterSign: row.letter_sign,
      photoUrl: row.photo_url,
      photoTitle: row.photo_title,
      photoSubtitle: row.photo_subtitle,
      theme: row.theme || 'clasico',
      bouquetStyle: row.bouquet_style || 'exuberante',
      audioUrl: row.audio_url,
      audioName: row.audio_name,
      notes: JSON.parse(row.notes_json || '[]'),
      animals: JSON.parse(row.animals_json || '[]')
    };
  } catch (e) {
    console.error("Error consultando regalo en SQLite:", e);
    return null;
  }
}

/**
 * Reactiva un regalo marchitado en SQLite agregando 1 semana adicional
 */
export function dbReviveGift(id: string): GiftData | null {
  try {
    const gift = dbGetGift(id);
    if (!gift) return null;

    const renewed: GiftData = {
      ...gift,
      createdAt: Date.now(),
      expiresAt: Date.now() + ONE_WEEK_MS
    };

    dbSaveGift(renewed);
    return renewed;
  } catch (e) {
    console.error("Error reviviendo regalo en SQLite:", e);
    return null;
  }
}

/**
 * Limpia regalos vencidos que lleven más de 1 semana inactivos
 */
export function dbPurgeExpired(): number {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`DELETE FROM regalos WHERE expires_at < ?`);
    const res = stmt.run(Date.now()) as any;
    return res?.changes || 0;
  } catch (e) {
    return 0;
  }
}

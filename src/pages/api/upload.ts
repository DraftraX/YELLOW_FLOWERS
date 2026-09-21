import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import { dbSaveAudio } from '../../utils/database';

export const prerender = false;

// Carpeta de almacenamiento para archivos multimedia:
// En Vercel Serverless solo /tmp es escribible; en local usamos public/uploads
const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    console.warn("No se pudo crear carpeta de uploads:", e);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'audio'; // 'audio' | 'image'

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: 'No se envió ningún archivo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // ============================================================
    // CASO 1: FOTO / IMAGEN -> COMPRESIÓN ULTRA LIGERA EN WEBP
    // ============================================================
    if (type === 'image') {
      try {
        // Redimensionar a máximo 500x500 y comprimir en WebP (calidad 80)
        // Esto reduce fotos de 5MB a solo 15-25 KB, ahorrando 99% de espacio
        const webpBuffer = await sharp(rawBuffer)
          .resize(500, 500, { fit: 'cover', position: 'center' })
          .webp({ quality: 80 })
          .toBuffer();

        const safeId = Math.random().toString(36).substring(2, 9);
        const webpFileName = `foto_${safeId}.webp`;
        const localFilePath = path.join(UPLOADS_DIR, webpFileName);

        // Guardar archivo .webp en la carpeta
        try {
          fs.writeFileSync(localFilePath, webpBuffer);
        } catch (writeErr) {
          console.warn("No se pudo escribir en disco local:", writeErr);
        }

        const base64Webp = webpBuffer.toString('base64');
        const webpDataUri = `data:image/webp;base64,${base64Webp}`;

        return new Response(JSON.stringify({
          success: true,
          url: webpDataUri, // WebP ultra compacto (~20KB) garantizado para funcionar en cualquier hosting
          localPath: `/uploads/${webpFileName}`,
          fileName: webpFileName,
          originalSize: file.size,
          compressedSize: webpBuffer.length,
          storageType: 'webp_compressed'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (sharpErr) {
        console.warn("Error comprimiendo con Sharp, usando buffer directo:", sharpErr);
      }
    }

    // ============================================================
    // CASO 2: AUDIO -> ALOJAMIENTO AUTÓNOMO EN SQLITE Y STREAMING LOCAL
    // ============================================================
    const audioId = `audio_${crypto.randomUUID().slice(0, 8)}`;
    const mimeType = file.type || 'audio/mpeg';

    // 1. Guardar archivo binario en SQLite
    try {
      dbSaveAudio(audioId, mimeType, rawBuffer);
    } catch (dbErr) {
      console.warn("No se pudo guardar audio en SQLite:", dbErr);
    }

    // 2. Guardar archivo en disco si es posible
    try {
      const ext = path.extname(file.name) || '.mp3';
      const audioFileName = `${audioId}${ext}`;
      const localAudioPath = path.join(UPLOADS_DIR, audioFileName);
      fs.writeFileSync(localAudioPath, rawBuffer);
    } catch (fsErr) {
      console.warn("No se pudo guardar audio en disco:", fsErr);
    }

    // URL ligera y directa al endpoint de streaming /api/audio
    const audioUrl = `/api/audio?id=${audioId}`;

    return new Response(JSON.stringify({
      success: true,
      url: audioUrl,
      id: audioId,
      fileName: file.name,
      fileSize: file.size,
      storageType: 'sqlite_stream'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });


  } catch (e: any) {
    console.error("Error en api/upload:", e);
    return new Response(JSON.stringify({
      success: false,
      error: e.message || 'Error procesando archivo'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

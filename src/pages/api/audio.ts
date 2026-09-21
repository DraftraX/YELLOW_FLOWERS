import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { dbGetAudio } from '../../utils/database';

export const prerender = false;

const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(process.cwd(), 'public', 'uploads');

export const GET: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get('id');
  const file = url.searchParams.get('file');

  let audioBuffer: Buffer | null = null;
  let mimeType = 'audio/mpeg';

  // 1. Buscar en SQLite
  if (id) {
    const audioRecord = dbGetAudio(id);
    if (audioRecord && audioRecord.data) {
      audioBuffer = audioRecord.data;
      mimeType = audioRecord.mime || 'audio/mpeg';
    }
  }

  // 2. Si no está en SQLite, buscar en disco local (/tmp/uploads o public/uploads)
  if (!audioBuffer && (id || file)) {
    const fileName = file || `${id}.mp3`;
    const safeName = path.basename(fileName);
    const candidatePaths = [
      path.join(UPLOADS_DIR, safeName),
      path.join(UPLOADS_DIR, `${id}.mp3`),
      path.join(UPLOADS_DIR, `${id}.wav`),
      path.join(UPLOADS_DIR, `${id}.m4a`)
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          audioBuffer = fs.readFileSync(p);
          const ext = path.extname(p).toLowerCase();
          if (ext === '.wav') mimeType = 'audio/wav';
          else if (ext === '.m4a') mimeType = 'audio/mp4';
          else if (ext === '.ogg') mimeType = 'audio/ogg';
          else mimeType = 'audio/mpeg';
          break;
        } catch (e) {}
      }
    }
  }

  if (!audioBuffer) {
    return new Response(JSON.stringify({ error: 'Audio no encontrado o expirado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const total = audioBuffer.length;
  const rangeHeader = request.headers.get('range');

  // Soporte para solicitudes de rango HTTP (necesario para streaming en celulares iOS y Android)
  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

    if (start >= total || end >= total || start > end) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${total}` }
      });
    }

    const chunk = audioBuffer.subarray(start, end + 1);

    return new Response(new Uint8Array(chunk), {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunk.length),
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=604800, immutable'
      }
    });
  }

  return new Response(new Uint8Array(audioBuffer), {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(total),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=604800, immutable'
    }
  });
};

import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import { getGift } from '../../utils/storage';

export const prerender = false;

// SVG predeterminado para generar portada hermosa si el usuario no subió foto
const FALLBACK_BOUQUET_SVG = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="60%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </radialGradient>
    <radialGradient id="petalGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="70%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </radialGradient>
    <radialGradient id="centerGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#78350F"/>
      <stop offset="70%" stop-color="#451A03"/>
      <stop offset="100%" stop-color="#1C0B02"/>
    </radialGradient>
  </defs>

  <!-- Fondo Radiante -->
  <rect width="600" height="600" fill="url(#bg)"/>

  <!-- Destellos decorativos -->
  <circle cx="120" cy="140" r="8" fill="#FFF" opacity="0.8"/>
  <circle cx="480" cy="120" r="6" fill="#FFF" opacity="0.8"/>
  <circle cx="500" cy="460" r="10" fill="#FFF" opacity="0.7"/>
  <circle cx="100" cy="480" r="7" fill="#FFF" opacity="0.8"/>

  <!-- Tallo central -->
  <path d="M 300 360 Q 300 480 300 540" stroke="#15803D" stroke-width="18" stroke-linecap="round" fill="none"/>
  <path d="M 300 440 Q 220 420 200 470 Q 260 480 300 460" fill="#16A34A"/>
  <path d="M 300 420 Q 380 400 400 450 Q 340 460 300 440" fill="#16A34A"/>

  <!-- Envoltorio de regalo -->
  <polygon points="220,440 380,440 340,550 260,550" fill="#D97706" opacity="0.9"/>
  <polygon points="240,440 360,440 320,550 280,550" fill="#B45309"/>

  <!-- Girasol central grande -->
  <g transform="translate(300, 260)">
    <!-- Pétalos rotados en círculo -->
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(22.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(45)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(67.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(90)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(112.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(135)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(157.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(180)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(202.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(225)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(247.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(270)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(292.5)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(315)"/>
    <ellipse cx="0" cy="-110" rx="22" ry="70" fill="url(#petalGrad)" transform="rotate(337.5)"/>

    <!-- Centro floral -->
    <circle cx="0" cy="0" r="70" fill="url(#centerGrad)" stroke="#B45309" stroke-width="4"/>
    <circle cx="0" cy="0" r="55" fill="none" stroke="#92400E" stroke-dasharray="4,6" stroke-width="3"/>
  </g>

  <!-- Banner texto inferior -->
  <rect x="50" y="490" width="500" height="75" rx="37.5" fill="#FFFFFF" opacity="0.95"/>
  <text x="300" y="528" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#B45309" text-anchor="middle">🌻 Flores Amarillas · 21 de Septiembre 💛</text>
  <text x="300" y="552" font-family="'Nunito', sans-serif" font-weight="700" font-size="15" fill="#78350F" text-anchor="middle">Toca para abrir tu regalo especial</text>
</svg>
`;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (id) {
    try {
      const { gift } = getGift(id);

      if (gift && gift.photoUrl) {
        // 1. Caso Base64 Data URI
        if (gift.photoUrl.startsWith('data:image/')) {
          const match = gift.photoUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (match && match[2]) {
            const mimeType = match[1] || 'image/webp';
            const imgBuffer = Buffer.from(match[2], 'base64');
            return new Response(imgBuffer, {
              status: 200,
              headers: {
                'Content-Type': mimeType,
                'Content-Length': String(imgBuffer.length),
                'Cache-Control': 'public, max-age=604800, immutable'
              }
            });
          }
        }

        // 2. Caso archivo local en /uploads/
        if (gift.photoUrl.startsWith('/uploads/')) {
          const fileName = path.basename(gift.photoUrl);
          const uploadDirs = [
            process.env.VERCEL ? path.join('/tmp', 'uploads', fileName) : '',
            path.join(process.cwd(), 'public', 'uploads', fileName)
          ].filter(Boolean);

          for (const candidatePath of uploadDirs) {
            if (fs.existsSync(candidatePath)) {
              const fileBuffer = fs.readFileSync(candidatePath);
              return new Response(fileBuffer, {
                status: 200,
                headers: {
                  'Content-Type': 'image/webp',
                  'Content-Length': String(fileBuffer.length),
                  'Cache-Control': 'public, max-age=604800, immutable'
                }
              });
            }
          }
        }

        // 3. Caso URL externa http
        if (gift.photoUrl.startsWith('http')) {
          return Response.redirect(gift.photoUrl, 302);
        }
      }
    } catch (e) {
      console.warn("Error resolviendo foto de regalo en /api/foto:", e);
    }
  }

  // Fallback: Generar imagen JPEG nítida optimizada para WhatsApp usando Sharp
  try {
    const jpegBuffer = await sharp(Buffer.from(FALLBACK_BOUQUET_SVG))
      .jpeg({ quality: 85 })
      .toBuffer();

    return new Response(jpegBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(jpegBuffer.length),
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (err) {
    // Si Sharp no pudiese rasterizar, devolver SVG nativo
    return new Response(FALLBACK_BOUQUET_SVG, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }
};

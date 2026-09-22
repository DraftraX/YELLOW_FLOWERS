import type { APIRoute } from 'astro';
import { saveGift, getGift } from '../../utils/storage';
import { getPublicOrigin } from '../../utils/origin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gift, token } = await saveGift(body);

    const origin = getPublicOrigin(request);
    // URL limpia que incluye el nombre del agasajado y el token de respaldo seguro
    const publicUrl = `${origin}/regalo/${gift.id}${token ? `?d=${token}` : ''}`;

    return new Response(JSON.stringify({
      success: true,
      id: gift.id,
      token,
      url: publicUrl,
      cleanUrl: `${origin}/regalo/${gift.id}`,
      expiresAt: gift.expiresAt,
      createdAt: gift.createdAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message || 'Error guardando regalo'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  const token = url.searchParams.get('d') || '';

  if (!id && !token) {
    return new Response(JSON.stringify({ error: 'Falta parámetro id o d' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { gift, isExpired, remainingText } = await getGift(id || '', token);
  if (!gift) {
    return new Response(JSON.stringify({ error: 'Regalo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    gift,
    isExpired,
    remainingText
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

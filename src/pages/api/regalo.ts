import type { APIRoute } from 'astro';
import { saveGift, getGift } from '../../utils/storage';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gift, token } = saveGift(body);

    const origin = new URL(request.url).origin;
    // URL limpia, corta y profesional usando UUID único sin parámetros innecesarios
    const publicUrl = `${origin}/regalo/${gift.id}`;

    return new Response(JSON.stringify({
      success: true,
      id: gift.id,
      token,
      url: publicUrl,
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
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta parámetro id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { gift, isExpired, remainingText } = getGift(id);
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

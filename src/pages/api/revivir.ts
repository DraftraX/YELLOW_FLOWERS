import type { APIRoute } from 'astro';
import { reviveGift } from '../../utils/storage';
import { getPublicOrigin } from '../../utils/origin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const idOrToken = body.id || body.token || 'especial';
    const { gift, token } = reviveGift(idOrToken);

    const origin = getPublicOrigin(request);
    const refreshedUrl = `${origin}/regalo/${gift.id}`;

    return new Response(JSON.stringify({
      success: true,
      message: '¡El ramo ha revivido con agua fresca por 1 semana más! 🌻💧',
      gift,
      token,
      url: refreshedUrl,
      expiresAt: gift.expiresAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message || 'Error reviviendo regalo'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

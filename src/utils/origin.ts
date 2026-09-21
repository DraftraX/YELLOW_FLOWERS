/**
 * Obtiene de forma confiable el origen público (dominio) de la aplicación,
 * evitando que los entornos serverless como Vercel retornen "localhost".
 */
export function getPublicOrigin(request?: Request): string {
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    if (forwardedHost && !forwardedHost.includes('localhost') && !forwardedHost.includes('127.0.0.1')) {
      return `${forwardedProto}://${forwardedHost}`;
    }

    const host = request.headers.get('host');
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      return `${forwardedProto}://${host}`;
    }
  }

  // Variables de entorno de Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.VERCEL) {
    return 'https://yellow-flowers-alpha.vercel.app';
  }

  // Si se está ejecutando localmente en desarrollo
  if (request) {
    try {
      return new URL(request.url).origin;
    } catch (e) {}
  }

  return 'https://yellow-flowers-alpha.vercel.app';
}

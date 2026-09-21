import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'audio'; // 'audio' | 'image'

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se subió ningún archivo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Límite de tamaño: 8 MB para audios e imágenes en serverless
    const maxSizeBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return new Response(JSON.stringify({
        error: `El archivo supera el límite de 8 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB)`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || (type === 'audio' ? 'audio/mpeg' : 'image/jpeg');
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    return new Response(JSON.stringify({
      success: true,
      url: dataUri,
      fileName: file.name,
      fileSize: file.size,
      mimeType: mimeType
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message || 'Error procesando archivo'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

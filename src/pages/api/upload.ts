import type { APIRoute } from 'astro';

export const prerender = false;

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

    // 1. Intentar subir a servicio libre de almacenamiento temporal (sin límite de tamaño estricto y con URL de streaming)
    try {
      const extFormData = new FormData();
      extFormData.append('file', file, file.name);

      const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: extFormData
      });

      if (uploadRes.ok) {
        const json = await uploadRes.json();
        if (json?.data?.url) {
          // Convertir URL de vista a URL de streaming directo
          const directStreamUrl = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          return new Response(JSON.stringify({
            success: true,
            url: directStreamUrl,
            fileName: file.name,
            fileSize: file.size,
            storageType: 'cloud_stream'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (extErr) {
      console.warn("Fallo subida a tmpfiles.org, usando fallback Base64:", extErr);
    }

    // 2. Fallback: Base64 data URI
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
      storageType: 'base64'
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

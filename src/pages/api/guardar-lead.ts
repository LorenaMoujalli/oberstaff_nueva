import type { APIRoute } from 'astro';
import { saveLead } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { webhookUrl, data } = body;

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Falta la URL del webhook' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Guardar en SQLite (Local)
    let dbSuccess = false;
    try {
      saveLead({
        webhook_url: webhookUrl,
        data: data || {}
      });
      dbSuccess = true;
    } catch (dbError) {
      console.error('Error guardando lead en SQLite:', dbError);
    }

    return new Response(JSON.stringify({
      success: true,
      sqlite: dbSuccess
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en el endpoint guardar-lead:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

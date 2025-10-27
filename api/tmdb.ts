import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const fullUrl = req.url || '';
  const tmdbPath = fullUrl.replace(/^\/api\/tmdb/, '');
  
  if (!tmdbPath) {
    return res.status(400).json({ error: 'Ruta TMDB no especificada' });
  }

  const apiKey = process.env['TMDB_API_KEY'];
  
  if (!apiKey) {
    console.error('TMDB_API_KEY no configurada en variables de entorno');
    return res.status(500).json({ error: 'Configuración del servidor incorrecta' });
  }

  const baseUrl = 'https://api.themoviedb.org/3';
  const tmdbUrl = `${baseUrl}${tmdbPath}`;
  const separator = tmdbPath.includes('?') ? '&' : '?';
  const finalUrl = `${tmdbUrl}${separator}api_key=${apiKey}`;

  try {
    console.log('Fetching from TMDB:', finalUrl.replace(apiKey, '***'));
    
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return res.status(500).json({ error: 'Error fetching data from TMDB' });
  }
}
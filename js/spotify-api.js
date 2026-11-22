/**
 * ESH OFFICIAL MERCH STORE - SPOTIFY WEB API CLIENT MODULE
 * Modular API client for Spotify catalog queries
 * Compatible with OAuth 2.0 PKCE via SpotifyAuth | Zero Client Secret | Zero Dependencies
 */

const SpotifyAPI = (() => {
  const BASE_URL = 'https://api.spotify.com/v1';
  const DEFAULT_ARTIST_ID = '0ZY9CCYal3geaJxMQDJ13t';
  const DEFAULT_MARKET = 'MX';
  const MAX_LIMIT = 10;

  /**
   * Asegura que el límite numérico se mantenga dentro del rango permitido (1 a 10)
   * @param {number|string} limit
   * @returns {number}
   */
  function sanitizeLimit(limit) {
    const parsed = parseInt(limit, 10);
    if (isNaN(parsed) || parsed < 1) return MAX_LIMIT;
    return Math.min(parsed, MAX_LIMIT);
  }

  /**
   * Realiza una petición HTTP autenticada a la Spotify Web API
   * @param {string} endpoint Ruta relativa (ej: '/artists/...')
   * @param {Object} queryParams Parámetros de consulta
   * @param {boolean} isRetry Bandera para evitar bucles infinitos de reintento en 401
   * @returns {Promise<Object>} Datos en formato JSON devueltos por Spotify
   */
  async function apiRequest(endpoint, queryParams = {}, isRetry = false) {
    if (typeof SpotifyAuth === 'undefined' || typeof SpotifyAuth.getAccessToken !== 'function') {
      throw new Error('[SpotifyAPI] El módulo SpotifyAuth no está disponible o no se ha cargado.');
    }

    const token = await SpotifyAuth.getAccessToken();
    if (!token) {
      throw new Error('[SpotifyAPI] No hay un token de acceso disponible. Se requiere autenticación previa.');
    }

    // Construcción de la URL con parámetros
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    let response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (networkError) {
      throw new Error(`[SpotifyAPI] Error de red al consultar ${url.pathname}: ${networkError.message}`);
    }

    // Manejo de expiración de sesión (401 Unauthorized) con un único reintento
    if (response.status === 401 && !isRetry) {
      console.warn('[SpotifyAPI] Recibido HTTP 401. Intentando renovar token...');
      try {
        const refreshedToken = await SpotifyAuth.getAccessToken();
        if (refreshedToken) {
          return await apiRequest(endpoint, queryParams, true);
        }
      } catch (refreshErr) {
        console.error('[SpotifyAPI] Fallo al renovar token tras 401:', refreshErr);
      }
      throw new Error('[SpotifyAPI] HTTP 401: Sesión de Spotify expirada o no autorizada.');
    }

    // Manejo de límite de solicitudes (429 Too Many Requests)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitMsg = retryAfter ? ` Reintenta en ${retryAfter} segundos.` : '';
      throw new Error(`[SpotifyAPI] HTTP 429: Límite de solicitudes de Spotify excedido.${waitMsg}`);
    }

    // Manejo de otros errores HTTP
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.error?.message || `HTTP ${response.status} en ${url.pathname}`;
      throw new Error(`[SpotifyAPI] Error de Spotify: ${message}`);
    }

    return await response.json();
  }

  /**
   * 1. Obtiene la información oficial de un artista
   * Endpoint: GET /v1/artists/{id}
   * @param {string} [artistId=DEFAULT_ARTIST_ID] ID del artista en Spotify
   * @returns {Promise<Object>} Datos del artista (nombre, imágenes, géneros, enlace externo)
   */
  async function getArtist(artistId = DEFAULT_ARTIST_ID) {
    if (!artistId || typeof artistId !== 'string' || artistId.trim() === '') {
      throw new Error('[SpotifyAPI.getArtist] Se requiere un artistId válido.');
    }
    const cleanId = encodeURIComponent(artistId.trim());
    return await apiRequest(`/artists/${cleanId}`);
  }

  /**
   * 2. Obtiene álbumes y sencillos oficiales de un artista
   * Endpoint: GET /v1/artists/{id}/albums
   * @param {string} [artistId=DEFAULT_ARTIST_ID] ID del artista
   * @param {Object} [options={}] Opciones adicionales (limit, market, offset)
   * @returns {Promise<Object>} Lista de álbumes y sencillos (máx 10 por solicitud)
   */
  async function getArtistAlbums(artistId = DEFAULT_ARTIST_ID, options = {}) {
    if (!artistId || typeof artistId !== 'string' || artistId.trim() === '') {
      throw new Error('[SpotifyAPI.getArtistAlbums] Se requiere un artistId válido.');
    }
    const cleanId = encodeURIComponent(artistId.trim());

    const params = {
      include_groups: options.include_groups || 'album,single',
      market: options.market || DEFAULT_MARKET,
      limit: sanitizeLimit(options.limit || MAX_LIMIT),
    };

    if (options.offset !== undefined && options.offset !== null) {
      params.offset = Math.max(0, parseInt(options.offset, 10) || 0);
    }

    return await apiRequest(`/artists/${cleanId}/albums`, params);
  }

  /**
   * 3. Obtiene las canciones de un álbum específico
   * Endpoint: GET /v1/albums/{id}/tracks
   * @param {string} albumId ID del álbum en Spotify
   * @param {Object} [options={}] Opciones adicionales (limit, market, offset)
   * @returns {Promise<Object>} Lista de canciones del álbum (máx 10 por solicitud)
   */
  async function getAlbumTracks(albumId, options = {}) {
    if (!albumId || typeof albumId !== 'string' || albumId.trim() === '') {
      throw new Error('[SpotifyAPI.getAlbumTracks] Se requiere un albumId válido.');
    }
    const cleanId = encodeURIComponent(albumId.trim());

    const params = {
      market: options.market || DEFAULT_MARKET,
      limit: sanitizeLimit(options.limit || MAX_LIMIT),
    };

    if (options.offset !== undefined && options.offset !== null) {
      params.offset = Math.max(0, parseInt(options.offset, 10) || 0);
    }

    return await apiRequest(`/albums/${cleanId}/tracks`, params);
  }

  /**
   * 4. Busca artistas, álbumes o canciones en el catálogo de Spotify
   * Endpoint: GET /v1/search
   * @param {string} query Término de búsqueda
   * @param {string|string[]} [type='artist,album,track'] Tipo o tipos de elementos
   * @param {Object} [options={}] Opciones adicionales (limit, market, offset)
   * @returns {Promise<Object>} Resultados de búsqueda estructurados
   */
  async function search(query, type = 'artist,album,track', options = {}) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      throw new Error('[SpotifyAPI.search] Se requiere un término de búsqueda (query) válido.');
    }

    const typeValue = Array.isArray(type) ? type.join(',') : type;
    const cleanQuery = query.trim();

    const params = {
      q: cleanQuery,
      type: typeValue,
      market: options.market || DEFAULT_MARKET,
      limit: sanitizeLimit(options.limit || MAX_LIMIT),
    };

    if (options.offset !== undefined && options.offset !== null) {
      params.offset = Math.max(0, parseInt(options.offset, 10) || 0);
    }

    return await apiRequest('/search', params);
  }

  /**
   * 5. Obtiene la discografía completa y estructurada del artista (álbumes y sencillos)
   * Utiliza el método oficial vigente getArtistAlbums; no depende de endpoints retirados como top-tracks.
   * @param {string} [artistId=DEFAULT_ARTIST_ID] ID del artista
   * @returns {Promise<Object>} Lista oficial de lanzamientos del artista
   */
  async function getArtistDiscography(artistId = DEFAULT_ARTIST_ID) {
    return await getArtistAlbums(artistId, {
      include_groups: 'album,single',
      market: DEFAULT_MARKET,
      limit: MAX_LIMIT,
    });
  }

  // Interfaz pública
  return {
    getArtist,
    getArtistAlbums,
    getAlbumTracks,
    search,
    getArtistDiscography,
  };
})();

// Exposición en el entorno global
if (typeof window !== 'undefined') {
  window.SpotifyAPI = SpotifyAPI;
}

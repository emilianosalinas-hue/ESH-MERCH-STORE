/**
 * ESH OFFICIAL MERCH STORE - SPOTIFY AUTHENTICATION MODULE
 * OAuth 2.0 Authorization Code Flow with PKCE (RFC 7636)
 * Pure Vanilla JavaScript | Zero Client Secret | Browser-native Web Crypto API
 */

const SpotifyAuth = (() => {
  // Claves de almacenamiento temporal en sessionStorage
  const STORAGE_KEYS = {
    CODE_VERIFIER: 'esh_sp_code_verifier',
    AUTH_STATE: 'esh_sp_auth_state',
    ACCESS_TOKEN: 'esh_sp_access_token',
    REFRESH_TOKEN: 'esh_sp_refresh_token',
    EXPIRES_AT: 'esh_sp_expires_at',
  };

  // Configuración de Spotify para ESH
  const defaultConfig = {
    clientId: '2e0e44c9822b437c9c5cab6057e69abc', // Marcador provisional: configurar con el Client ID de Spotify Dashboard
    redirectUri: window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:5500/ESH-MERCH-STORE/index.html'
      : 'https://emilianosalinas-hue.github.io/ESH-MERCH-STORE/',
    artistId: '0ZY9CCYal3geaJxMQDJ13t',
    scope: '',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    authorizeEndpoint: 'https://accounts.spotify.com/authorize',
  };

  let config = { ...defaultConfig };

  /**
   * Actualiza o combina la configuración activa
   * @param {Object} customConfig
   */
  function setConfig(customConfig = {}) {
    config = {
      ...config,
      ...customConfig,
    };
  }

  /**
   * Lee la configuración global si existe (ej. window.SPOTIFY_CONFIG)
   */
  function loadGlobalConfig() {
    if (typeof window !== 'undefined' && window.SPOTIFY_CONFIG) {
      setConfig(window.SPOTIFY_CONFIG);
    }
  }

  // --- 1. Generación de Criptografía PKCE (Web Crypto API) ---

  /**
   * Genera una cadena aleatoria criptográficamente segura
   * @param {number} length Longitud de la cadena (estándar 64)
   * @returns {string} Cadena aleatoria
   */
  function generateRandomString(length = 64) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues, (byte) => possible[byte % possible.length]).join('');
  }

  /**
   * Calcula el hash SHA-256 de code_verifier y lo codifica en Base64URL
   * @param {string} plain Cadena de texto plano (code_verifier)
   * @returns {Promise<string>} Retorna el code_challenge
   */
  async function generateCodeChallenge(plain) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API no disponible en este entorno.');
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // --- 2. Flujo de Autorización (Login) ---

  /**
   * Inicia el flujo de autenticación redirigiendo al usuario a Spotify
   * @returns {Promise<void>}
   */
  async function login() {
    loadGlobalConfig();

    if (!config.clientId || config.clientId === 'TU_SPOTIFY_CLIENT_ID' || config.clientId.trim() === '') {
      console.warn('[SpotifyAuth] Client ID no configurado. Asigna un Client ID válido antes de autorizar.');
      dispatchAuthError('CLIENT_ID_MISSING', 'Falta configurar el Client ID de Spotify.');
      return;
    }

    try {
      const verifier = generateRandomString(64);
      const challenge = await generateCodeChallenge(verifier);
      const state = generateRandomString(32);

      // Persistir verifier y state en sessionStorage para su posterior validación
      sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);
      sessionStorage.setItem(STORAGE_KEYS.AUTH_STATE, state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        redirect_uri: config.redirectUri,
        state: state,
      });

      // Solo agregar scope cuando contenga permisos explícitos
      if (config.scope && config.scope.trim() !== '') {
        params.append('scope', config.scope.trim());
      }

      // Redirigir a Spotify Accounts
      window.location.href = `${config.authorizeEndpoint}?${params.toString()}`;
    } catch (error) {
      console.error('[SpotifyAuth] Error al inicializar flujo PKCE:', error);
      dispatchAuthError('PKCE_INIT_FAILED', error.message);
    }
  }

  // --- 3. Procesamiento de Callback y Canje de Token ---

  /**
   * Comprueba si la URL actual contiene parámetros de respuesta de Spotify
   * @returns {boolean} True si detecta code o error en la búsqueda
   */
  function isCallback() {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.has('code') || params.has('error');
  }

  /**
   * Limpia los parámetros de consulta OAuth de la URL sin recargar la página
   */
  function cleanUrlParams() {
    if (typeof window === 'undefined' || !window.history || !window.history.replaceState) return;

    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      url.searchParams.delete('error');

      const cleanSearch = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
      const cleanUrl = `${url.pathname}${cleanSearch}${url.hash}`;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {
      console.warn('[SpotifyAuth] No se pudo limpiar la URL:', e);
    }
  }

  /**
   * Procesa el código de autorización y lo intercambia por un access_token
   * @returns {Promise<boolean>} True si el intercambio concluyó exitosamente
   */
  async function handleCallback() {
    loadGlobalConfig();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');
    const errorParam = urlParams.get('error');

    // Si no hay parámetros de OAuth, salir
    if (!code && !errorParam) {
      return false;
    }

    // Caso 1: Cancelación del usuario o error devuelto por Spotify
    if (errorParam) {
      console.warn('[SpotifyAuth] Autorización cancelada o denegada:', errorParam);
      cleanUrlParams();
      sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      dispatchAuthError('AUTH_CANCELLED', `Spotify devolvió el error: ${errorParam}`);
      return false;
    }

    // Caso 2: Recepción de código
    const savedState = sessionStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    const verifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

    // Validación de state (prevención de CSRF)
    if (!returnedState || returnedState !== savedState) {
      console.error('[SpotifyAuth] Validación de state fallida. Posible ataque CSRF o sesión inválida.');
      cleanUrlParams();
      sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      dispatchAuthError('STATE_MISMATCH', 'La validación del estado CSRF falló.');
      return false;
    }

    // Limpiar inmediatamente los parámetros visibles en la URL
    cleanUrlParams();

    if (!verifier) {
      console.error('[SpotifyAuth] No se encontró code_verifier en sessionStorage.');
      dispatchAuthError('VERIFIER_MISSING', 'No se localizó el verificador de código previo.');
      return false;
    }

    try {
      const payload = new URLSearchParams({
        client_id: config.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.redirectUri,
        code_verifier: verifier,
      });

      const response = await fetch(config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      // Eliminar datos de uso único
      sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_description || `HTTP ${response.status} al intercambiar el token.`);
      }

      const tokenData = await response.json();
      saveTokens(tokenData);

      dispatchAuthSuccess(tokenData);
      return true;
    } catch (err) {
      console.error('[SpotifyAuth] Error en el intercambio de token:', err);
      dispatchAuthError('TOKEN_EXCHANGE_FAILED', err.message);
      return false;
    }
  }

  // --- 4. Gestión y Renovación de Tokens ---

  /**
   * Guarda los tokens y su expiración en sessionStorage
   * @param {Object} tokenData Respuesta de Spotify
   */
  function saveTokens(tokenData) {
    if (!tokenData || !tokenData.access_token) return;

    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.access_token);

    if (tokenData.refresh_token) {
      sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refresh_token);
    }

    const expiresInSec = tokenData.expires_in || 3600;
    const expiresAt = Date.now() + expiresInSec * 1000;
    sessionStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
  }

  /**
   * Renueva el access_token utilizando el refresh_token
   * @returns {Promise<string|null>} Nuevo access_token o null en caso de fallo
   */
  async function refreshAccessToken() {
    loadGlobalConfig();
    const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      console.warn('[SpotifyAuth] No hay refresh_token disponible.');
      logout();
      return null;
    }

    try {
      const payload = new URLSearchParams({
        client_id: config.clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const response = await fetch(config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error(`Fallo al refrescar token: HTTP ${response.status}`);
      }

      const tokenData = await response.json();
      saveTokens(tokenData);

      return tokenData.access_token;
    } catch (error) {
      console.error('[SpotifyAuth] Error en renovación de token:', error);
      logout();
      dispatchAuthError('REFRESH_FAILED', error.message);
      return null;
    }
  }

  /**
   * Obtiene un access_token vigente, renovándolo automáticamente si ha expirado
   * @returns {Promise<string|null>} Token listo para usar o null
   */

  async function getAccessToken() {
    const accessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAtRaw = sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!accessToken || !expiresAtRaw) {
      if (refreshToken) {
        return await refreshAccessToken();
      }
      return null;
    }

    const expiresAt = parseInt(expiresAtRaw, 10);
    const isExpired = !Number.isFinite(expiresAt) ||
      Date.now() >= expiresAt - 60000;

    if (isExpired) {
      return await refreshAccessToken();
    }

    return accessToken;
  }


  /**
   * Comprueba si el usuario tiene una sesión activa
   * @returns {boolean}
   */
  function isAuthenticated() {
    const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAtRaw = sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!token && !refreshToken) return false;
    if (token && expiresAtRaw && Date.now() < parseInt(expiresAtRaw, 10)) return true;
    return !!refreshToken;
  }

  /**
   * Cierra la sesión activa y elimina datos temporales
   */
  function logout() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('esh:spotify-logout'));
    }
  }

  // --- 5. Eventos Personalizados (Desacoplados) ---

  function dispatchAuthSuccess(data) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('esh:spotify-auth-success', {
          detail: {
            accessToken: data.access_token,
            expiresIn: data.expires_in,
          },
        })
      );
    }
  }

  function dispatchAuthError(code, message) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('esh:spotify-auth-error', {
          detail: { code, message },
        })
      );
    }
  }

  // --- 6. Inicialización Automática ---

  /**
   * Inicializa el módulo, procesando callback en caso de estar retornando de Spotify
   */
  async function init(customConfig = {}) {
    setConfig(customConfig);
    loadGlobalConfig();

    if (isCallback()) {
      await handleCallback();
    }
  }

  return {
    init,
    login,
    logout,
    getAccessToken,
    isAuthenticated,
    handleCallback,
    setConfig,
    isCallback,
  };
})();

// Exposición global segura
if (typeof window !== 'undefined') {
  window.SpotifyAuth = SpotifyAuth;
}

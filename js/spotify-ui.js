/**
 * ESH OFFICIAL MERCH STORE - SPOTIFY RADIO UI MODULE
 * Visual controller for the ESH RADIO section
 * Relies on SpotifyAuth and SpotifyAPI. Zero dependencies. Pure Vanilla JS.
 */

const SpotifyUI = (() => {
  const ARTIST_ID = '0ZY9CCYal3geaJxMQDJ13t';

  let state = {
    albums: [],
    selectedAlbumId: null,
    selectedAlbumUri: null,
    tracks: [],
    isLoading: false,
  };

  /* ─────────────────────────── DOM HELPERS ─────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function setHTML(id, html) {
    const node = el(id);
    if (node) node.innerHTML = html;
  }

  function show(id) {
    const node = el(id);
    if (node) node.style.display = '';
  }

  function hide(id) {
    const node = el(id);
    if (node) node.style.display = 'none';
  }

  /* ─────────────────────────── RENDER UTILS ─────────────────────────── */

  function formatDuration(ms) {
    if (!ms || isNaN(ms)) return '--:--';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  function renderSkeleton(count = 4, variant = 'album') {
    return Array.from({ length: count }, () =>
      variant === 'album'
        ? `<div class="sp-album-skeleton sp-skeleton-anim"></div>`
        : `<div class="sp-track-skeleton sp-skeleton-anim"></div>`
    ).join('');
  }

  /* ─────────────────────────── AUTH STATE ─────────────────────────── */

  function renderConnectView() {
    setHTML('sp-radio-body', `
      <div class="sp-connect-screen">
        <div class="sp-connect-icon">▶</div>
        <h3 class="sp-connect-title">ESH RADIO</h3>
        <p class="sp-connect-sub">Conecta tu cuenta de Spotify para escuchar la discografía oficial de ESH, explorar lanzamientos y buscar canciones.</p>
        <button id="sp-login-btn" class="sp-btn-connect">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.52 17.317c-.215.354-.673.465-1.027.249-2.814-1.72-6.355-2.11-10.527-1.157-.401.09-.8-.159-.893-.56-.09-.4.158-.8.56-.892 4.564-1.044 8.479-.594 11.638 1.337.353.216.465.674.249 1.023zm1.473-3.274c-.27.44-.842.577-1.283.308-3.221-1.98-8.127-2.553-11.934-1.397-.494.15-1.014-.129-1.166-.623-.149-.494.13-1.014.624-1.165 4.35-1.32 9.75-.681 13.449 1.595.44.27.577.842.31 1.282zm.127-3.407c-3.863-2.296-10.237-2.508-13.922-1.387-.593.18-1.22-.153-1.4-.747-.18-.594.153-1.22.747-1.4 4.233-1.284 11.27-1.036 15.72 1.605.534.317.71 1.005.392 1.54-.316.533-1.005.71-1.537.389z"/></svg>
          CONECTAR SPOTIFY
        </button>
        <p class="sp-connect-note">La autenticación se realiza de forma segura mediante OAuth 2.0 PKCE. ESH STORE no almacena contraseñas.</p>
      </div>
    `);
    const btn = el('sp-login-btn');
    if (btn) btn.addEventListener('click', () => SpotifyAuth.login());
  }

  function renderAuthError(message) {
    setHTML('sp-radio-body', `
      <div class="sp-error-screen">
        <span class="sp-error-icon">✦</span>
        <p class="sp-error-msg">${message}</p>
        <button id="sp-retry-login" class="sp-btn-outline">INTENTAR DE NUEVO</button>
      </div>
    `);
    const btn = el('sp-retry-login');
    if (btn) btn.addEventListener('click', () => SpotifyAuth.login());
  }

  /* ─────────────────────────── PROFILE ─────────────────────────── */

  function renderArtistProfile(artist) {
    const img = artist.images && artist.images.length > 0
      ? artist.images[0].url
      : '';
    const spotifyUrl = artist.external_urls && artist.external_urls.spotify
      ? artist.external_urls.spotify
      : '#';

    setHTML('sp-artist-profile', `
      <div class="sp-profile-inner">
        ${img ? `<img src="${img}" alt="ESH en Spotify" class="sp-artist-img" loading="lazy">` : '<div class="sp-artist-img-placeholder">ESH</div>'}
        <div class="sp-profile-info">
          <span class="label-mono" style="color: var(--color-crimson);">ARTISTA OFICIAL</span>
          <h2 class="sp-artist-name">${artist.name || 'ESH'}</h2>
          <a href="${spotifyUrl}" target="_blank" rel="noopener" class="sp-artist-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.52 17.317c-.215.354-.673.465-1.027.249-2.814-1.72-6.355-2.11-10.527-1.157-.401.09-.8-.159-.893-.56-.09-.4.158-.8.56-.892 4.564-1.044 8.479-.594 11.638 1.337.353.216.465.674.249 1.023zm1.473-3.274c-.27.44-.842.577-1.283.308-3.221-1.98-8.127-2.553-11.934-1.397-.494.15-1.014-.129-1.166-.623-.149-.494.13-1.014.624-1.165 4.35-1.32 9.75-.681 13.449 1.595.44.27.577.842.31 1.282zm.127-3.407c-3.863-2.296-10.237-2.508-13.922-1.387-.593.18-1.22-.153-1.4-.747-.18-.594.153-1.22.747-1.4 4.233-1.284 11.27-1.036 15.72 1.605.534.317.71 1.005.392 1.54-.316.533-1.005.71-1.537.389z"/></svg>
            ESCUCHAR EN SPOTIFY
          </a>
        </div>
      </div>
    `);
  }

  /* ─────────────────────────── DISCOGRAPHY ─────────────────────────── */

  function renderAlbums(albums) {
    state.albums = albums;

    if (!albums || albums.length === 0) {
      setHTML('sp-albums-grid', `<p class="sp-empty-msg">No se encontraron lanzamientos disponibles en este momento.</p>`);
      return;
    }

    const html = albums.map((album, i) => {
      const cover = album.images && album.images.length > 0
        ? album.images[0].url
        : '';
      const year = album.release_date ? album.release_date.substring(0, 4) : '';
      const type = album.album_type === 'single' ? 'SINGLE' : 'ÁLBUM';
      const totalTracks = album.total_tracks || '';

      return `
        <button class="sp-album-card${i === 0 ? ' sp-album-active' : ''}"
          data-album-id="${album.id}"
          data-album-uri="${album.uri || ''}"
          aria-label="Ver canciones de ${album.name}"
        >
          <div class="sp-album-cover-wrap">
            ${cover
              ? `<img src="${cover}" alt="${album.name}" class="sp-album-cover" loading="lazy">`
              : `<div class="sp-album-cover-placeholder">◆</div>`
            }
            <span class="sp-album-type-badge">${type}</span>
          </div>
          <div class="sp-album-meta">
            <span class="sp-album-title">${album.name}</span>
            <span class="sp-album-year">${year}${totalTracks ? ` · ${totalTracks} pistas` : ''}</span>
          </div>
        </button>
      `;
    }).join('');

    setHTML('sp-albums-grid', html);

    // Eventos de selección
    document.querySelectorAll('.sp-album-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sp-album-card').forEach(b => b.classList.remove('sp-album-active'));
        btn.classList.add('sp-album-active');
        const albumId = btn.getAttribute('data-album-id');
        const albumUri = btn.getAttribute('data-album-uri');
        loadAlbumTracks(albumId, albumUri);
      });
    });

    // Cargar el primer lanzamiento automáticamente
    if (albums[0]) {
      loadAlbumTracks(albums[0].id, albums[0].uri || '');
    }
  }

  /* ─────────────────────────── TRACKS ─────────────────────────── */

  async function loadAlbumTracks(albumId, albumUri) {
    state.selectedAlbumId = albumId;
    state.selectedAlbumUri = albumUri;

    setHTML('sp-tracks-list', renderSkeleton(5, 'track'));
    updateEmbed(albumUri);

    try {
      const data = await SpotifyAPI.getAlbumTracks(albumId);
      state.tracks = data.items || [];
      renderTracks(state.tracks, albumUri);
    } catch (err) {
      console.error('[SpotifyUI] Error al cargar pistas:', err);
      setHTML('sp-tracks-list', `<p class="sp-error-inline">No se pudieron cargar las canciones: ${err.message}</p>`);
    }
  }

  function renderTracks(tracks, albumUri) {
    if (!tracks || tracks.length === 0) {
      setHTML('sp-tracks-list', `<p class="sp-empty-msg">No hay canciones disponibles en este lanzamiento.</p>`);
      return;
    }

    const html = tracks.map((track, i) => {
      const duration = formatDuration(track.duration_ms);
      const spotifyUrl = track.external_urls && track.external_urls.spotify
        ? track.external_urls.spotify
        : '#';
      const trackUri = track.uri || '';

      return `
        <div class="sp-track-row" data-track-uri="${trackUri}">
          <span class="sp-track-num">${String(track.track_number || i + 1).padStart(2, '0')}</span>
          <span class="sp-track-name">${track.name}</span>
          <span class="sp-track-duration">${duration}</span>
          <a href="${spotifyUrl}" target="_blank" rel="noopener" class="sp-track-open" aria-label="Abrir ${track.name} en Spotify">↗</a>
        </div>
      `;
    }).join('');

    setHTML('sp-tracks-list', html);
  }

  /* ─────────────────────────── EMBED PLAYER ─────────────────────────── */

  function updateEmbed(uri) {
    const container = el('sp-embed-container');
    if (!container) return;

    if (!uri) {
      container.innerHTML = '';
      return;
    }

    // URI format: spotify:album:ID  → extract ID
    const parts = uri.split(':');
    const type = parts[1] || 'album';
    const id = parts[2] || '';

    if (!id) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <iframe
        id="sp-embed-iframe"
        title="Spotify Player – ESH RADIO"
        src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0"
        width="100%"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    `;
  }

  /* ─────────────────────────── SEARCH ─────────────────────────── */

  let searchDebounceTimer = null;

  function initSearch() {
    const input = el('sp-search-input');
    const resultsContainer = el('sp-search-results');
    if (!input || !resultsContainer) return;

    input.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      const query = input.value.trim();

      if (!query) {
        setHTML('sp-search-results', '');
        return;
      }

      setHTML('sp-search-results', '<div class="sp-search-loading">Buscando…</div>');

      searchDebounceTimer = setTimeout(async () => {
        try {
          const data = await SpotifyAPI.search(query, 'artist,album,track');
          renderSearchResults(data);
        } catch (err) {
          setHTML('sp-search-results', `<p class="sp-error-inline">Error en búsqueda: ${err.message}</p>`);
        }
      }, 350);
    });
  }

  function renderSearchResults(data) {
    let html = '';

    const artists = data.artists && data.artists.items ? data.artists.items : [];
    const albums = data.albums && data.albums.items ? data.albums.items : [];
    const tracks = data.tracks && data.tracks.items ? data.tracks.items : [];

    if (!artists.length && !albums.length && !tracks.length) {
      setHTML('sp-search-results', '<p class="sp-empty-msg">Sin resultados para esta búsqueda.</p>');
      return;
    }

    if (artists.length) {
      html += `<div class="sp-search-section-label label-mono">ARTISTAS</div>`;
      html += artists.map(a => {
        const img = a.images && a.images.length > 0 ? a.images[a.images.length - 1].url : '';
        const url = a.external_urls && a.external_urls.spotify ? a.external_urls.spotify : '#';
        return `
          <a href="${url}" target="_blank" rel="noopener" class="sp-search-row">
            ${img ? `<img src="${img}" alt="${a.name}" class="sp-search-thumb sp-search-thumb-round">` : `<div class="sp-search-thumb sp-search-thumb-round sp-search-thumb-ph">A</div>`}
            <span class="sp-search-name">${a.name}</span>
            <span class="sp-search-meta">Artista</span>
          </a>`;
      }).join('');
    }

    if (albums.length) {
      html += `<div class="sp-search-section-label label-mono">ÁLBUMES</div>`;
      html += albums.map(a => {
        const img = a.images && a.images.length > 0 ? a.images[a.images.length - 1].url : '';
        const url = a.external_urls && a.external_urls.spotify ? a.external_urls.spotify : '#';
        const year = a.release_date ? a.release_date.substring(0, 4) : '';
        return `
          <a href="${url}" target="_blank" rel="noopener" class="sp-search-row">
            ${img ? `<img src="${img}" alt="${a.name}" class="sp-search-thumb">` : `<div class="sp-search-thumb sp-search-thumb-ph">◆</div>`}
            <span class="sp-search-name">${a.name}</span>
            <span class="sp-search-meta">${year}</span>
          </a>`;
      }).join('');
    }

    if (tracks.length) {
      html += `<div class="sp-search-section-label label-mono">CANCIONES</div>`;
      html += tracks.map(t => {
        const url = t.external_urls && t.external_urls.spotify ? t.external_urls.spotify : '#';
        const dur = formatDuration(t.duration_ms);
        return `
          <a href="${url}" target="_blank" rel="noopener" class="sp-search-row">
            <div class="sp-search-thumb sp-search-thumb-track">▶</div>
            <span class="sp-search-name">${t.name}</span>
            <span class="sp-search-meta">${dur}</span>
          </a>`;
      }).join('');
    }

    setHTML('sp-search-results', html);
  }

  /* ─────────────────────────── MAIN LOADER ─────────────────────────── */

  async function loadRadio() {
    const body = el('sp-radio-body');
    if (!body) return;

    // Show main layout skeleton
    body.innerHTML = `
      <div id="sp-artist-profile" class="sp-artist-profile">
        <div class="sp-profile-skeleton sp-skeleton-anim"></div>
      </div>

      <div class="sp-discography-wrap">
        <div class="sp-col-left">
          <div class="sp-section-label label-mono">DISCOGRAFÍA</div>
          <div id="sp-albums-grid" class="sp-albums-grid">
            ${renderSkeleton(4, 'album')}
          </div>
        </div>

        <div class="sp-col-right">
          <div id="sp-embed-container" class="sp-embed-container"></div>
          <div class="sp-section-label label-mono">CANCIONES</div>
          <div id="sp-tracks-list" class="sp-tracks-list">
            ${renderSkeleton(5, 'track')}
          </div>
        </div>
      </div>

      <div class="sp-search-wrap">
        <div class="sp-section-label label-mono">BUSCADOR</div>
        <div class="sp-search-bar-wrap">
          <input
            id="sp-search-input"
            type="text"
            class="sp-search-input"
            placeholder="Buscar artistas, álbumes, canciones…"
            autocomplete="off"
            maxlength="100"
          >
        </div>
        <div id="sp-search-results" class="sp-search-results"></div>
      </div>
    `;

    initSearch();

    try {
      const [artist, discography] = await Promise.all([
        SpotifyAPI.getArtist(ARTIST_ID),
        SpotifyAPI.getArtistDiscography(ARTIST_ID),
      ]);

      renderArtistProfile(artist);
      renderAlbums(discography.items || []);
    } catch (err) {
      console.error('[SpotifyUI] Error cargando ESH RADIO:', err);
      setHTML('sp-artist-profile', '');
      setHTML('sp-albums-grid', `<p class="sp-error-inline">${err.message}</p>`);
    }
  }

  /* ─────────────────────────── INIT ─────────────────────────── */

  async function init() {
    const section = el('esh-radio');
    if (!section) return;

    // Listen to auth events
    window.addEventListener('esh:spotify-auth-success', async () => {
      await loadRadio();
    });

    window.addEventListener('esh:spotify-logout', () => {
      renderConnectView();
    });

    window.addEventListener('esh:spotify-auth-error', (e) => {
      const { code, message } = e.detail || {};
      if (code !== 'CLIENT_ID_MISSING') {
        renderAuthError(`Error de autenticación: ${message || 'Vuelve a intentarlo.'}`);
      } else {
        renderConnectView();
      }
    });

    // Initialize SpotifyAuth (handles callback if returning from Spotify)
    await SpotifyAuth.init();

    // Render based on session state
    if (SpotifyAuth.isAuthenticated()) {
      await loadRadio();
    } else {
      renderConnectView();
    }
  }

  return { init };
})();

// Auto-init after DOM is ready
if (typeof window !== 'undefined') {
  window.SpotifyUI = SpotifyUI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpotifyUI.init());
  } else {
    SpotifyUI.init();
  }
}

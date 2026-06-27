// ═══════════════════════════════════════════════════════════
// PriismaTv - Main Application (Fully Working)
// ═══════════════════════════════════════════════════════════

class PriismaTv {
    constructor() {
        this.content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT)) || [];
        this.watchlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST)) || [];
        this.favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        this.friends = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS)) || [];
        this.currentPage = 'home';
        this.currentDetailItem = null;
        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindSearch();
        this.bindSidebar();
        this.bindModal();
        this.bindAdmin();
        this.bindFriends();
        this.bindVideoPlayer();
        this.bindThemeToggle();
        this.bindChat();
        this.renderHome();
        this.updateStats();
        this.updateNotifBadge();
        this.fixMissingPosters();
    }

    // Auto-fix ALL items - fetch real poster images from TMDB
    async fixMissingPosters() {
        const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
        let updated = false;
        let fixed = 0;

        for (let item of this.content) {
            // Check if poster loads by testing the URL format
            // TMDB paths should be valid — but many we have are made up
            // Force re-fetch for any item that hasn't been verified
            if (item.posterVerified) continue;

            try {
                const searchType = item.type === 'movie' ? 'movie' : 'tv';
                const res = await fetch(
                    `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(item.title)}&year=${item.year || ''}`
                );
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    if (result.poster_path) {
                        item.poster = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
                        updated = true;
                        fixed++;
                    }
                    if (result.backdrop_path) {
                        item.backdrop = `https://image.tmdb.org/t/p/original${result.backdrop_path}`;
                    }
                    item.posterVerified = true;
                }
                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 250));
            } catch (e) {
                // Skip failed fetches
            }
        }

        if (updated) {
            this.saveContent();
            this.renderHome();
            if (fixed > 0) {
                this.showToast(`Updated ${fixed} cover images`, 'success');
            }
        }
    }

    // ═══════ NAVIGATION ═══════
    bindNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        this.currentPage = page;
        // Update active states
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        const pageEl = document.getElementById(`page-${page}`);
        const navEl = document.querySelector(`.nav-links [data-page="${page}"]`);
        if (pageEl) pageEl.classList.add('active');
        if (navEl) navEl.classList.add('active');

        // Render page
        switch (page) {
            case 'home': this.renderHome(); break;
            case 'movies': this.renderMovies(); break;
            case 'anime': this.renderAnime(); break;
            case 'tvshows': this.renderTVShows(); break;
            case 'watchtogether': this.initWatchTogether(); break;
            case 'youtube': this.initYouTube(); break;
            case 'twitch': this.initTwitch(); break;
            case 'watchlist': this.renderWatchlist(); break;
            case 'favorites': this.renderFavorites(); break;
            case 'friends': this.renderFriends(); break;
            case 'admin': this.updateStats(); break;
        }

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('mobile-open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ═══════ SIDEBAR ═══════
    bindSidebar() {
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    bindThemeToggle() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('collapsed');
        });
    }


    // ═══════ SEARCH ═══════
    bindSearch() {
        const input = document.getElementById('searchInput');
        const results = document.getElementById('searchResults');
        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = input.value.toLowerCase().trim();
                if (query.length < 2) {
                    results.classList.remove('active');
                    return;
                }
                const matches = this.content.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    (item.genre && item.genre.toLowerCase().includes(query)) ||
                    (item.type && item.type.toLowerCase().includes(query)) ||
                    (item.description && item.description.toLowerCase().includes(query)) ||
                    (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
                ).slice(0, 8);

                if (matches.length === 0) {
                    results.innerHTML = `<div class="search-result-item" style="justify-content:center; color: var(--text-muted);">No results for "${query}"</div>`;
                } else {
                    results.innerHTML = matches.map(item => `
                        <div class="search-result-item" data-id="${item.id}">
                            <img src="${item.poster || this.getPlaceholder(item.title)}" alt="${item.title}" onerror="this.src='${this.getPlaceholder(item.title)}'">
                            <div class="search-result-info">
                                <h4>${this.highlightMatch(item.title, query)}</h4>
                                <span>${this.formatType(item.type)} &bull; ${item.year || 'N/A'} &bull; ★ ${item.rating || 'N/A'}</span>
                            </div>
                        </div>
                    `).join('');
                }
                results.classList.add('active');
                this.bindSearchResults(results, input);
            }, 200);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { results.classList.remove('active'); input.blur(); }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) results.classList.remove('active');
        });
    }

    bindSearchResults(results, input) {
        results.querySelectorAll('.search-result-item[data-id]').forEach(el => {
            el.addEventListener('click', () => {
                const item = this.content.find(c => c.id === el.dataset.id);
                if (item) this.openDetail(item);
                results.classList.remove('active');
                input.value = '';
            });
        });
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark style="background:rgba(0,212,255,0.3);color:white;border-radius:2px;padding:0 2px;">$1</mark>');
    }


    // ═══════ RENDER HOME ═══════
    renderHome() {
        this.renderHero();
        this.renderRow('trendingRow', this.getByTag('trending'));
        this.renderRow('recentRow', this.getRecent());
        this.renderRow('topRatedRow', this.getByTag('top-rated'));
        this.renderRow('animeRow', this.content.filter(c => c.type === 'anime'));
    }

    renderHero() {
        const featured = this.content.filter(c => c.tags && c.tags.includes('must-watch'));
        const item = featured.length > 0
            ? featured[Math.floor(Math.random() * featured.length)]
            : this.content[0];
        if (!item) return;

        this.currentHeroItem = item;
        const backdrop = document.getElementById('heroBackdrop');
        if (item.backdrop) {
            backdrop.style.backgroundImage = `url(${item.backdrop})`;
        } else if (item.poster) {
            backdrop.style.backgroundImage = `url(${item.poster})`;
        }

        document.getElementById('heroTitle').textContent = item.title;
        document.getElementById('heroDescription').textContent = item.description || 'No description available.';

        const meta = document.getElementById('heroMeta');
        meta.innerHTML = `
            ${item.rating ? `<span class="rating"><i class="fas fa-star"></i> ${item.rating}</span>` : ''}
            ${item.year ? `<span><i class="fas fa-calendar"></i> ${item.year}</span>` : ''}
            ${item.genre ? `<span><i class="fas fa-tag"></i> ${this.capitalizeFirst(item.genre)}</span>` : ''}
            ${item.duration ? `<span><i class="fas fa-clock"></i> ${item.duration}</span>` : ''}
            ${item.episodes ? `<span><i class="fas fa-list"></i> ${item.episodes} eps</span>` : ''}
        `;

        document.getElementById('heroWatch').onclick = () => this.playContent(item);
        document.getElementById('heroInfo').onclick = () => this.openDetail(item);

        const heroFav = document.getElementById('heroFav');
        heroFav.classList.toggle('active', this.favorites.includes(item.id));
        heroFav.onclick = () => {
            this.toggleFavorite(item.id);
            heroFav.classList.toggle('active', this.favorites.includes(item.id));
        };
    }

    renderRow(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.length > 0
            ? items.map(item => this.createCard(item)).join('')
            : '<p style="color: var(--text-muted); padding: 20px;">No content yet. Add some!</p>';
        this.bindCardEvents(container);
    }

    // ═══════ RENDER CATEGORY PAGES ═══════
    renderMovies() {
        const genre = document.getElementById('movieGenreFilter').value;
        const sort = document.getElementById('movieSortFilter').value;
        let items = this.content.filter(c => c.type === 'movie');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('moviesGrid', items);
        document.getElementById('movieGenreFilter').onchange = () => this.renderMovies();
        document.getElementById('movieSortFilter').onchange = () => this.renderMovies();
    }

    renderAnime() {
        const genre = document.getElementById('animeGenreFilter').value;
        const sort = document.getElementById('animeSortFilter').value;
        let items = this.content.filter(c => c.type === 'anime');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('animeGrid', items);
        document.getElementById('animeGenreFilter').onchange = () => this.renderAnime();
        document.getElementById('animeSortFilter').onchange = () => this.renderAnime();
    }

    renderTVShows() {
        const genre = document.getElementById('tvGenreFilter').value;
        const sort = document.getElementById('tvSortFilter').value;
        let items = this.content.filter(c => c.type === 'tvshow');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('tvshowsGrid', items);
        document.getElementById('tvGenreFilter').onchange = () => this.renderTVShows();
        document.getElementById('tvSortFilter').onchange = () => this.renderTVShows();
    }

    renderWatchlist() {
        const items = this.content.filter(c => this.watchlist.includes(c.id));
        document.getElementById('watchlistCount').textContent = `${items.length} items`;
        const empty = document.getElementById('watchlistEmpty');
        if (items.length === 0) {
            empty.classList.add('active');
            document.getElementById('watchlistGrid').innerHTML = '';
        } else {
            empty.classList.remove('active');
            this.renderGrid('watchlistGrid', items);
        }
        document.getElementById('clearWatchlist').onclick = () => {
            if (confirm('Clear your entire watchlist?')) {
                this.watchlist = [];
                this.saveWatchlist();
                this.renderWatchlist();
                this.showToast('Watchlist cleared', 'info');
            }
        };
    }

    renderFavorites() {
        const items = this.content.filter(c => this.favorites.includes(c.id));
        document.getElementById('favoritesCount').textContent = `${items.length} items`;
        const empty = document.getElementById('favoritesEmpty');
        if (items.length === 0) {
            empty.classList.add('active');
            document.getElementById('favoritesGrid').innerHTML = '';
        } else {
            empty.classList.remove('active');
            this.renderGrid('favoritesGrid', items);
        }
    }

    renderGrid(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.length > 0
            ? items.map(item => this.createCard(item)).join('')
            : '<p style="color: var(--text-muted); padding: 40px; text-align: center; grid-column: 1/-1;">No content found</p>';
        this.bindCardEvents(container);
    }


    // ═══════ CARD CREATION ═══════
    createCard(item) {
        const isWatchlist = this.watchlist.includes(item.id);
        const isFavorite = this.favorites.includes(item.id);
        const posterUrl = item.poster || this.getPlaceholder(item.title);

        return `
            <div class="content-card" data-id="${item.id}">
                <div class="card-poster">
                    <img src="${posterUrl}" alt="${item.title}" loading="lazy"
                         onerror="this.src='${this.getPlaceholder(item.title)}'">
                    <span class="card-type-badge ${item.type}">${this.formatType(item.type)}</span>
                    <div class="card-overlay">
                        <div class="card-overlay-actions">
                            <button class="play-btn" data-id="${item.id}" title="Watch Now">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="watchlist-btn ${isWatchlist ? 'active' : ''}" data-id="${item.id}" title="${isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                                <i class="fas fa-bookmark"></i>
                            </button>
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" title="${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <div class="card-meta">
                        ${item.rating ? `<span class="rating"><i class="fas fa-star"></i> ${item.rating}</span>` : ''}
                        <span>${item.year || ''}</span>
                        <span>${item.genre ? this.capitalizeFirst(item.genre) : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    bindCardEvents(container) {
        // Click card to open detail
        container.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.watchlist-btn') || e.target.closest('.favorite-btn') || e.target.closest('.play-btn')) return;
                const item = this.content.find(c => c.id === card.dataset.id);
                if (item) this.openDetail(item);
            });
        });

        // Play buttons - watch directly
        container.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = this.content.find(c => c.id === btn.dataset.id);
                if (item) {
                    this.currentDetailItem = item;
                    this.playContent(item);
                }
            });
        });

        // Watchlist buttons
        container.querySelectorAll('.watchlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWatchlist(btn.dataset.id);
                btn.classList.toggle('active');
                btn.title = btn.classList.contains('active') ? 'Remove from Watchlist' : 'Add to Watchlist';
            });
        });

        // Favorite buttons
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(btn.dataset.id);
                btn.classList.toggle('active');
                btn.title = btn.classList.contains('active') ? 'Remove from Favorites' : 'Add to Favorites';
            });
        });
    }


    // ═══════ DETAIL MODAL ═══════
    bindModal() {
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('detailModal')) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeVideoPlayer();
            }
        });
    }

    openDetail(item) {
        this.currentDetailItem = item;
        const modal = document.getElementById('detailModal');
        const backdrop = document.getElementById('modalBackdrop');

        // Set backdrop
        if (item.backdrop) {
            backdrop.style.backgroundImage = `url(${item.backdrop})`;
        } else if (item.poster) {
            backdrop.style.backgroundImage = `url(${item.poster})`;
        } else {
            backdrop.style.backgroundImage = 'none';
            backdrop.style.background = 'var(--bg-tertiary)';
        }

        // Set poster
        const posterEl = document.getElementById('modalPoster');
        posterEl.innerHTML = `<img src="${item.poster || this.getPlaceholder(item.title)}" alt="${item.title}" onerror="this.src='${this.getPlaceholder(item.title)}'">`;

        // Set info
        document.getElementById('modalTitle').textContent = item.title;
        document.getElementById('modalDescription').textContent = item.description || 'No description available.';

        // Meta info
        const meta = document.getElementById('modalMeta');
        meta.innerHTML = `
            ${item.rating ? `<span class="rating"><i class="fas fa-star"></i> ${item.rating}/10</span>` : ''}
            ${item.year ? `<span><i class="fas fa-calendar"></i> ${item.year}</span>` : ''}
            ${item.genre ? `<span><i class="fas fa-tag"></i> ${this.capitalizeFirst(item.genre)}</span>` : ''}
            ${item.duration ? `<span><i class="fas fa-clock"></i> ${item.duration}</span>` : ''}
            ${item.episodes ? `<span><i class="fas fa-list"></i> ${item.episodes} episodes</span>` : ''}
            ${item.seasons ? `<span><i class="fas fa-layer-group"></i> ${item.seasons} season${item.seasons > 1 ? 's' : ''}</span>` : ''}
            <span><i class="fas fa-${item.type === 'movie' ? 'film' : item.type === 'anime' ? 'dragon' : 'tv'}"></i> ${this.formatType(item.type)}</span>
        `;

        // Watch button - always try to play (auto-finds stream if needed)
        const watchBtn = document.getElementById('modalWatch');
        watchBtn.style.opacity = '1';
        watchBtn.onclick = () => this.playContent(item);

        // Watchlist button
        const wlBtn = document.getElementById('modalWatchlist');
        const isWl = this.watchlist.includes(item.id);
        wlBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${isWl ? 'In Watchlist' : 'Add to Watchlist'}`;
        wlBtn.onclick = () => {
            this.toggleWatchlist(item.id);
            const nowWl = this.watchlist.includes(item.id);
            wlBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${nowWl ? 'In Watchlist' : 'Add to Watchlist'}`;
        };

        // Favorite button
        const favBtn = document.getElementById('modalFavorite');
        favBtn.classList.toggle('active', this.favorites.includes(item.id));
        favBtn.onclick = () => {
            this.toggleFavorite(item.id);
            favBtn.classList.toggle('active', this.favorites.includes(item.id));
        };

        // Share button
        document.getElementById('modalShare').onclick = () => this.shareItem(item);

        // Delete button
        document.getElementById('modalDelete').onclick = () => this.deleteItem(item);

        // Trailer button - always works by searching YouTube in 4K
        const trailerBtn = document.getElementById('modalTrailer');
        trailerBtn.style.display = 'inline-flex';
        trailerBtn.onclick = () => {
            const isAnime = item.type === 'anime';
            const searchTerm = isAnime 
                ? `${item.title} anime official trailer 4K` 
                : `${item.title} ${item.year || ''} official trailer 4K HDR`;
            const query = encodeURIComponent(searchTerm);
            
            if (item.trailer && item.trailer.length === 11) {
                this.playTrailer(item.trailer, query);
            } else {
                this.playTrailer(null, query);
            }
        };

        // Links section
        const linksEl = document.getElementById('modalLinks');
        let links = '';
        if (item.video) links += `<a href="${item.video}" target="_blank"><i class="fas fa-play-circle"></i> Stream Link</a>`;
        if (item.magnet) links += `<a href="${item.magnet}"><i class="fas fa-magnet"></i> Magnet Link</a>`;
        linksEl.innerHTML = links;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('detailModal').classList.remove('active');
        document.body.style.overflow = '';
        this.currentDetailItem = null;
    }

    deleteItem(item) {
        if (!confirm(`Delete "${item.title}" from your collection?`)) return;
        this.content = this.content.filter(c => c.id !== item.id);
        this.watchlist = this.watchlist.filter(id => id !== item.id);
        this.favorites = this.favorites.filter(id => id !== item.id);
        this.saveContent();
        this.saveWatchlist();
        this.saveFavorites();
        this.closeModal();
        this.navigateTo(this.currentPage);
        this.updateStats();
        this.showToast(`"${item.title}" deleted`, 'info');
    }

    shareItem(item) {
        const data = { items: [item], from: 'PriismaTv', shared: new Date().toISOString() };
        const code = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        this.copyToClipboard(code);
        this.showToast('Share code copied! Send it to your friends.', 'success');
    }


    // ═══════ VIDEO PLAYER ═══════
    bindVideoPlayer() {
        document.getElementById('videoPlayerClose').addEventListener('click', () => this.closeVideoPlayer());
        document.getElementById('videoPlayerFullscreen').addEventListener('click', () => this.toggleFullscreen());
    }

    toggleFullscreen() {
        const player = document.getElementById('videoPlayer');
        const content = document.getElementById('videoPlayerContent');
        const iframe = content.querySelector('iframe');
        
        // Try to fullscreen the iframe first (best experience)
        const target = iframe || content;
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.webkitRequestFullscreen) {
                target.webkitRequestFullscreen();
            } else if (target.msRequestFullscreen) {
                target.msRequestFullscreen();
            } else if (player.requestFullscreen) {
                player.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    playContent(item) {
        if (!item.video && !item.magnet) {
            // Try to generate a VidSrc link on-the-fly using TMDB
            this.autoStreamFromTitle(item);
            return;
        }

        if (item.magnet) {
            window.open(item.magnet);
            this.showToast('Opening in your torrent client...', 'info');
            return;
        }

        const url = this.convertToEmbed(item.video);
        
        // If it's a Streamtape/Filemoon/byse link, open directly (they block iframe embedding)
        if (/streamtape\.(com|to)/i.test(url) || /filemoon\.(sx|to|in)/i.test(url) || /byselapuix\.com/i.test(url)) {
            window.open(url, '_blank');
            this.showToast('Opening in new tab — plays in full quality there!', 'success');
            return;
        }

        // If the URL is a vidsrc/embed source, extract IMDB ID for multi-source
        const imdbMatch = url.match(/(?:embed\/(?:movie|tv)\/)?(tt\d+)/);
        if (imdbMatch) {
            const imdbId = imdbMatch[1];
            const type = item.type === 'movie' ? 'movie' : 'tv';
            this.launchPlayer(url, imdbId, type);
        } else {
            this.launchPlayer(url);
        }
    }

    launchPlayer(url, imdbId = null, type = 'movie') {
        const playerContainer = document.getElementById('videoPlayer');
        const playerContent = document.getElementById('videoPlayerContent');
        const sourceBar = document.getElementById('videoSourceBar');

        // If we have an IMDB ID, show source switcher with embeddable providers
        if (imdbId) {
            const sources = this.getEmbedSources(imdbId, type);
            const isShow = (type === 'tv' || this.currentDetailItem?.type === 'anime' || this.currentDetailItem?.type === 'tvshow');
            const isAnime = this.currentDetailItem?.type === 'anime';
            
            // Season/Episode selector for TV shows and anime
            let episodeBar = '';
            if (isShow) {
                const maxSeasons = this.currentDetailItem?.seasons || 4;
                const maxEpisodes = this.currentDetailItem?.episodes ? Math.min(Math.ceil(this.currentDetailItem.episodes / maxSeasons), 26) : 12;
                episodeBar = `
                    <div class="episode-selector" id="episodeSelector">
                        <select id="seasonSelect" onchange="app.changeEpisode()">
                            ${Array.from({length: maxSeasons}, (_, i) => `<option value="${i+1}">S${i+1}</option>`).join('')}
                        </select>
                        <select id="episodeSelect" onchange="app.changeEpisode()">
                            ${Array.from({length: maxEpisodes}, (_, i) => `<option value="${i+1}">E${i+1}</option>`).join('')}
                        </select>
                    </div>
                `;
            }

            // Dubbed/Subbed toggle for anime - opens aniwave for real sub/dub selection
            let dubSubBar = '';
            if (isAnime) {
                const animeTitle = encodeURIComponent(this.currentDetailItem?.title || '');
                dubSubBar = `
                    <div class="dub-sub-toggle" id="dubSubToggle">
                        <button class="dub-btn" onclick="window.open('https://aniwaves.ru/search?keyword=${animeTitle}','_blank');app.showToast('Opening Aniwave - select SUB or DUB there','info')">SUB/DUB</button>
                    </div>
                `;
            }

            sourceBar.innerHTML = sources.map((s, i) => 
                `<button class="${i === 0 ? 'active' : ''}" onclick="app.switchSource('${s.url}', this)">${s.name}</button>`
            ).join('') + episodeBar + dubSubBar;
            sourceBar.style.display = 'flex';
            
            // Store current IMDB for episode changes
            this.currentImdbId = imdbId;
            this.currentPlayerType = type;
            
            // Load first source inline
            playerContent.innerHTML = `<iframe src="${sources[0].url}" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen scrolling="no" referrerpolicy="origin" style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
        } else {
            sourceBar.style.display = 'none';
            if (this.isYouTubeUrl(url)) {
                const videoId = this.getYouTubeId(url);
                playerContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
            } else if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
                playerContent.innerHTML = `<video controls autoplay style="width:100%;height:100%;background:#000;position:absolute;top:0;left:0;"><source src="${url}" type="video/mp4"></video>`;
            } else {
                playerContent.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; fullscreen; encrypted-media" allowfullscreen scrolling="no" style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
            }
        }

        playerContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.closeModal();
    }

    // Embed sources - 1080p HD priority ordering
    getEmbedSources(imdbId, type, season = 1, episode = 1) {
        const isMovie = type === 'movie';
        const s = season;
        const e = episode;

        if (isMovie) {
            return [
                { name: '1080p Server 1', url: `https://multiembed.mov/?video_id=${imdbId}&tmdb=1&quality=1080p` },
                { name: '1080p Server 2', url: `https://autoembed.co/movie/imdb/${imdbId}` },
                { name: '1080p Server 3', url: `https://vidsrc.me/embed/movie?imdb=${imdbId}` },
                { name: 'HD Server 4', url: `https://2embed.cc/embed/${imdbId}` },
                { name: 'HD Server 5', url: `https://vidsrc.io/embed/movie/${imdbId}` },
            ];
        }

        // TV Shows & Anime
        return [
            { name: '1080p Server 1', url: `https://multiembed.mov/?video_id=${imdbId}&tmdb=1&s=${s}&e=${e}&quality=1080p` },
            { name: '1080p Server 2', url: `https://autoembed.co/tv/imdb/${imdbId}-${s}-${e}` },
            { name: '1080p Server 3', url: `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${s}&episode=${e}` },
            { name: 'HD Server 4', url: `https://2embed.cc/embedtv/${imdbId}&s=${s}&e=${e}` },
            { name: 'HD Server 5', url: `https://vidsrc.io/embed/tv/${imdbId}/${s}/${e}` },
        ];
    }

    titleToSlug(title) {
        if (!title) return '';
        return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    }

    switchSource(url, btn) {
        document.querySelectorAll('.video-source-bar button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const playerContent = document.getElementById('videoPlayerContent');
        playerContent.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen scrolling="no" referrerpolicy="origin" style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
    }

    // Change episode/season
    changeEpisode() {
        const season = document.getElementById('seasonSelect').value;
        const episode = document.getElementById('episodeSelect').value;
        const imdbId = this.currentImdbId;
        const type = this.currentPlayerType;
        
        if (!imdbId) return;
        
        // Update sources with new season/episode
        const sources = this.getEmbedSources(imdbId, type, season, episode);
        
        // Update source bar buttons
        const sourceBar = document.getElementById('videoSourceBar');
        const buttons = sourceBar.querySelectorAll('button:not(.dub-btn)');
        buttons.forEach((btn, i) => {
            if (sources[i]) {
                btn.onclick = () => this.switchSource(sources[i].url, btn);
            }
        });
        
        // Load first source with new episode
        const playerContent = document.getElementById('videoPlayerContent');
        playerContent.innerHTML = `<iframe src="${sources[0].url}" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen scrolling="no" referrerpolicy="origin" style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
        
        // Mark first button active
        buttons.forEach(b => b.classList.remove('active'));
        if (buttons[0]) buttons[0].classList.add('active');
    }

    // Switch between dubbed and subbed for anime
    // Opens aniwaves.ru where you can actually select sub or dub

    // Auto-find streaming link when no video URL is saved
    async autoStreamFromTitle(item) {
        this.showToast('Finding stream...', 'info');
        this.currentDetailItem = item; // Store for source switcher
        const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
        // Anime and TV shows search as 'tv', movies search as 'movie'
        const searchType = item.type === 'movie' ? 'movie' : 'tv';

        try {
            // Search TMDB for this title
            const searchRes = await fetch(
                `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(item.title)}&year=${item.year || ''}`
            );
            const searchData = await searchRes.json();

            if (!searchData.results || searchData.results.length === 0) {
                this.showToast('Could not find this title. Add a stream link manually.', 'error');
                return;
            }

            const tmdbId = searchData.results[0].id;

            // Get IMDB ID
            const idsRes = await fetch(
                `https://api.themoviedb.org/3/${searchType}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
            );
            const idsData = await idsRes.json();
            const imdbId = idsData.imdb_id;

            if (!imdbId) {
                this.showToast('No streaming source found for this title.', 'error');
                return;
            }

            // Generate streaming URL - autoembed.co confirmed working
            const streamUrl = searchType === 'movie'
                ? `https://autoembed.co/movie/imdb/${imdbId}`
                : `https://autoembed.co/tv/imdb/${imdbId}-1-1`;

            // Save it to the item so it doesn't have to look it up again
            item.video = streamUrl;
            item.imdbId = imdbId;
            item.tmdbId = tmdbId;
            this.saveContent();

            // Play it inline with multi-source selector
            this.launchPlayer(streamUrl, imdbId, searchType);
            this.showToast('Stream loaded!', 'success');

        } catch (err) {
            this.showToast('Error finding stream. Check your connection.', 'error');
        }
    }

    // ═══════ AUTO-CONVERT STREAMING URLS ═══════
    convertToEmbed(url) {
        if (!url) return url;

        // Streamtape: convert /v/ to /e/
        if (/streamtape\.com\/v\//i.test(url)) {
            return url.replace('/v/', '/e/');
        }
        // Streamtape: if already /e/, keep it
        if (/streamtape\.com\/e\//i.test(url)) {
            return url;
        }
        // Streamtape: handle streamtape.to as well
        if (/streamtape\.to\/v\//i.test(url)) {
            return url.replace('/v/', '/e/');
        }

        // Filemoon: convert /d/ or /f/ to /e/
        if (/filemoon\.(sx|to|in)\/[df]\//i.test(url)) {
            return url.replace(/\/[df]\//, '/e/');
        }
        // Filemoon: if already /e/, keep it
        if (/filemoon\.(sx|to|in)\/e\//i.test(url)) {
            return url;
        }

        // Doodstream: convert /d/ to /e/
        if (/dood\.(watch|to|so|pm|wf|re)\/d\//i.test(url)) {
            return url.replace('/d/', '/e/');
        }

        // Mixdrop: convert /f/ to /e/
        if (/mixdrop\.(co|to|sx|ch)\/f\//i.test(url)) {
            return url.replace('/f/', '/e/');
        }

        // Upstream: convert /watch/ to /embed-
        if (/upstream\.to\/watch\//i.test(url)) {
            const id = url.split('/watch/')[1]?.split('.')[0];
            if (id) return `https://upstream.to/embed-${id}.html`;
        }

        // VidSrc (IMDB-based free streaming)
        if (/vidsrc\.(me|to|xyz)\/embed/i.test(url)) {
            return url;
        }

        // Google Drive: convert /file/d/ID/view to /file/d/ID/preview
        if (/drive\.google\.com\/file\/d\//i.test(url)) {
            return url.replace('/view', '/preview').replace('/edit', '/preview');
        }

        // If nothing matched, return as-is (will be used in iframe)
        return url;
    }

    closeVideoPlayer() {
        const playerContainer = document.getElementById('videoPlayer');
        const playerContent = document.getElementById('videoPlayerContent');
        const sourceBar = document.getElementById('videoSourceBar');
        playerContainer.classList.remove('active');
        playerContent.innerHTML = '';
        sourceBar.innerHTML = '';
        sourceBar.style.display = 'none';
        document.body.style.overflow = '';
    }

    playTrailer(trailerId, searchQuery = null) {
        const playerContainer = document.getElementById('videoPlayer');
        const playerContent = document.getElementById('videoPlayerContent');
        const sourceBar = document.getElementById('videoSourceBar');
        
        // If we have a trailer ID, embed it directly (most reliable)
        if (trailerId) {
            sourceBar.innerHTML = `
                <button class="active" style="pointer-events:none;"><i class="fas fa-video"></i> 4K Trailer</button>
                <button onclick="window.open('https://www.youtube.com/watch?v=${trailerId}','_blank')"><i class="fab fa-youtube"></i> Open on YouTube</button>
            `;
            sourceBar.style.display = 'flex';
            playerContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1&vq=hd2160" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"></iframe>`;
            playerContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.closeModal();
        } else if (searchQuery) {
            // No trailer ID saved — open YouTube search directly (guaranteed to work)
            window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
            this.showToast('Opening 4K trailer on YouTube...', 'info');
        }
    }

    isYouTubeUrl(url) {
        return /(?:youtube\.com|youtu\.be)/i.test(url);
    }

    getYouTubeId(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
        return match ? match[1] : '';
    }

    isVimeoUrl(url) {
        return /vimeo\.com/i.test(url);
    }


    // ═══════ ADMIN - ADD CONTENT ═══════
    bindAdmin() {
        document.getElementById('addContentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContent();
        });
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        document.getElementById('resetAllData').addEventListener('click', () => this.resetAllData());

        // Auto-fetch poster when title is typed
        let fetchTimer;
        document.getElementById('contentTitle').addEventListener('input', (e) => {
            clearTimeout(fetchTimer);
            const title = e.target.value.trim();
            if (title.length < 3) {
                document.getElementById('posterPreviewGroup').style.display = 'none';
                document.getElementById('titleFetchStatus').textContent = '';
                return;
            }
            document.getElementById('titleFetchStatus').textContent = 'Searching for posters...';
            document.getElementById('titleFetchStatus').style.color = 'var(--accent-primary)';
            fetchTimer = setTimeout(() => this.fetchPosterFromTMDB(title), 800);
        });
    }

    // ═══════ AUTO-FETCH POSTER FROM TMDB ═══════
    async fetchPosterFromTMDB(title) {
        const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'; // Free public demo key
        const statusEl = document.getElementById('titleFetchStatus');
        const previewGroup = document.getElementById('posterPreviewGroup');
        const resultsEl = document.getElementById('posterResults');

        try {
            const type = document.getElementById('contentType').value;
            const searchType = type === 'movie' ? 'movie' : 'tv';
            const response = await fetch(
                `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&page=1`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const results = data.results.slice(0, 5); // Top 5 results
                statusEl.textContent = `Found ${data.results.length} results — click a poster to auto-fill everything + streaming link`;
                statusEl.style.color = '#00ff88';

                resultsEl.innerHTML = results.map(r => {
                    const poster = r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : '';
                    const backdrop = r.backdrop_path ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` : '';
                    const name = r.title || r.name || '';
                    const year = (r.release_date || r.first_air_date || '').split('-')[0];
                    if (!poster) return '';
                    return `<img src="${poster}" alt="${name} (${year})" title="${name} (${year})"
                        data-poster="${poster}" data-backdrop="${backdrop}"
                        data-tmdb-id="${r.id}" data-type="${searchType}"
                        data-year="${year}" data-description="${(r.overview || '').replace(/"/g, '&quot;')}"
                        data-rating="${r.vote_average ? r.vote_average.toFixed(1) : ''}"
                        data-title="${name}"
                        onclick="app.selectPoster(this)">`;
                }).join('');

                previewGroup.style.display = 'block';
            } else {
                statusEl.textContent = 'No results found — try a different title or add poster URL manually';
                statusEl.style.color = 'var(--text-muted)';
                previewGroup.style.display = 'none';
            }
        } catch (err) {
            statusEl.textContent = 'Could not fetch (check internet connection)';
            statusEl.style.color = '#ff4444';
            previewGroup.style.display = 'none';
        }
    }

    async selectPoster(imgEl) {
        // Highlight selected
        document.querySelectorAll('.poster-results img').forEach(i => i.classList.remove('selected'));
        imgEl.classList.add('selected');

        // Auto-fill fields
        const poster = imgEl.dataset.poster;
        const backdrop = imgEl.dataset.backdrop;
        const year = imgEl.dataset.year;
        const description = imgEl.dataset.description;
        const rating = imgEl.dataset.rating;
        const tmdbId = imgEl.dataset.tmdbId;
        const type = imgEl.dataset.type;
        const title = imgEl.dataset.title;

        if (poster) document.getElementById('contentPoster').value = poster;
        if (backdrop) document.getElementById('contentBackdrop').value = backdrop;
        if (year) document.getElementById('contentYear').value = year;
        if (description) document.getElementById('contentDescription').value = description;
        if (rating) document.getElementById('contentRating').value = rating;
        if (title) document.getElementById('contentTitle').value = title;

        // Fetch IMDB ID from TMDB and generate streaming link
        if (tmdbId) {
            try {
                const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
                const detailRes = await fetch(
                    `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
                );
                const ids = await detailRes.json();
                const imdbId = ids.imdb_id;

                if (imdbId) {
                    // Use autoembed.co - confirmed working embed
                    const streamUrl = type === 'movie'
                        ? `https://autoembed.co/movie/imdb/${imdbId}`
                        : `https://autoembed.co/tv/imdb/${imdbId}-1-1`;
                    document.getElementById('contentVideo').value = streamUrl;

                    // Also fetch trailer
                    try {
                        const videosRes = await fetch(
                            `https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
                        );
                        const videosData = await videosRes.json();
                        const trailer = videosData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                        if (trailer) {
                            document.getElementById('contentTrailer').value = trailer.key;
                        }
                    } catch(e) {}

                    this.showToast('HD streaming link + trailer auto-generated!', 'success');
                } else {
                    this.showToast('Poster filled! Add a streaming link manually if needed.', 'info');
                }
            } catch (err) {
                this.showToast('Poster filled! Could not get streaming link automatically.', 'info');
            }
        } else {
            this.showToast('Poster, backdrop & info auto-filled!', 'success');
        }
    }

    addContent() {
        const title = document.getElementById('contentTitle').value.trim();
        if (!title) { this.showToast('Title is required!', 'error'); return; }

        const newItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            title: title,
            type: document.getElementById('contentType').value,
            year: parseInt(document.getElementById('contentYear').value) || new Date().getFullYear(),
            rating: parseFloat(document.getElementById('contentRating').value) || null,
            genre: document.getElementById('contentGenre').value,
            description: document.getElementById('contentDescription').value.trim() || null,
            poster: document.getElementById('contentPoster').value.trim() || null,
            backdrop: document.getElementById('contentBackdrop').value.trim() || null,
            video: document.getElementById('contentVideo').value.trim() || null,
            magnet: document.getElementById('contentMagnet').value.trim() || null,
            trailer: document.getElementById('contentTrailer').value.trim() || null,
            duration: document.getElementById('contentDuration').value.trim() || null,
            episodes: parseInt(document.getElementById('contentEpisodes').value) || null,
            seasons: parseInt(document.getElementById('contentSeasons').value) || null,
            tags: document.getElementById('contentTags').value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
            dateAdded: new Date().toISOString().split('T')[0]
        };

        this.content.unshift(newItem); // Add to beginning
        this.saveContent();
        this.updateStats();
        document.getElementById('addContentForm').reset();
        this.showToast(`"${title}" added to your collection!`, 'success');
        this.updateNotifBadge();
    }

    exportData() {
        const data = {
            content: this.content,
            watchlist: this.watchlist,
            favorites: this.favorites,
            friends: this.friends,
            exportDate: new Date().toISOString(),
            version: '2.0',
            app: 'PriismaTv'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `priismatv_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Collection exported! Keep this backup safe.', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                let imported = 0;
                if (data.content && Array.isArray(data.content)) {
                    data.content.forEach(item => {
                        if (!this.content.find(c => c.id === item.id || c.title === item.title)) {
                            this.content.push(item);
                            imported++;
                        }
                    });
                    this.saveContent();
                }
                if (data.watchlist) { this.watchlist = [...new Set([...this.watchlist, ...data.watchlist])]; this.saveWatchlist(); }
                if (data.favorites) { this.favorites = [...new Set([...this.favorites, ...data.favorites])]; this.saveFavorites(); }
                if (data.friends) {
                    data.friends.forEach(f => {
                        if (!this.friends.find(fr => fr.name === f.name)) this.friends.push(f);
                    });
                    this.saveFriends();
                }
                this.updateStats();
                this.navigateTo(this.currentPage);
                this.showToast(`Imported ${imported} new items!`, 'success');
            } catch (err) {
                this.showToast('Invalid backup file format', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    resetAllData() {
        if (!confirm('This will DELETE all your content, watchlist, favorites, and friends. Are you sure?')) return;
        if (!confirm('REALLY sure? This cannot be undone!')) return;
        localStorage.removeItem(STORAGE_KEYS.CONTENT);
        localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
        localStorage.removeItem(STORAGE_KEYS.FAVORITES);
        localStorage.removeItem(STORAGE_KEYS.FRIENDS);
        initializeData();
        this.content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT)) || [];
        this.watchlist = [];
        this.favorites = [];
        this.friends = [];
        this.updateStats();
        this.navigateTo('home');
        this.showToast('All data reset to defaults', 'info');
    }


    // ═══════ FRIENDS ═══════
    bindFriends() {
        document.getElementById('addFriendBtn').addEventListener('click', () => this.addFriend());
        document.getElementById('friendName').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this.addFriend(); }
        });
        document.getElementById('shareListBtn').addEventListener('click', () => this.shareCollection());
        document.getElementById('importListBtn').addEventListener('click', () => this.importSharedList());
    }

    renderFriends() {
        const list = document.getElementById('friendsList');
        if (this.friends.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">No friends added yet. Add your close friends above!</p>';
        } else {
            list.innerHTML = this.friends.map((f, i) => `
                <div class="friend-item">
                    <div class="avatar">${f.name.charAt(0).toUpperCase()}</div>
                    <span>${f.name}</span>
                    <button onclick="app.removeFriend(${i})" title="Remove"><i class="fas fa-times"></i></button>
                </div>
            `).join('');
        }
    }

    addFriend() {
        const input = document.getElementById('friendName');
        const name = input.value.trim();
        if (!name) { this.showToast('Enter a name', 'error'); return; }
        if (this.friends.find(f => f.name.toLowerCase() === name.toLowerCase())) {
            this.showToast('Already in your friends list', 'info');
            return;
        }
        this.friends.push({ name, addedAt: new Date().toISOString() });
        this.saveFriends();
        this.renderFriends();
        input.value = '';
        this.showToast(`${name} added as a friend!`, 'success');
    }

    removeFriend(index) {
        const name = this.friends[index]?.name;
        this.friends.splice(index, 1);
        this.saveFriends();
        this.renderFriends();
        if (name) this.showToast(`${name} removed`, 'info');
    }

    shareCollection() {
        const shareData = {
            items: this.content,
            watchlist: this.watchlist,
            favorites: this.favorites,
            from: 'PriismaTv',
            shared: new Date().toISOString()
        };
        const code = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
        this.copyToClipboard(code);
        this.showToast('Share code copied! Send it to your friends so they can import your collection.', 'success');
    }

    importSharedList() {
        const code = document.getElementById('importCode').value.trim();
        if (!code) { this.showToast('Paste a share code first', 'error'); return; }
        try {
            const json = decodeURIComponent(escape(atob(code)));
            const data = JSON.parse(json);
            let added = 0;

            if (data.items && Array.isArray(data.items)) {
                data.items.forEach(item => {
                    if (!this.content.find(c => c.id === item.id || c.title === item.title)) {
                        this.content.push(item);
                        added++;
                    }
                });
                this.saveContent();
            }

            if (data.watchlist && Array.isArray(data.watchlist)) {
                data.watchlist.forEach(id => {
                    if (!this.watchlist.includes(id)) this.watchlist.push(id);
                });
                this.saveWatchlist();
            }

            this.updateStats();
            document.getElementById('importCode').value = '';
            this.showToast(`Imported ${added} new items from your friend's collection!`, 'success');
        } catch (err) {
            this.showToast('Invalid share code. Make sure you copied it completely.', 'error');
        }
    }


    // ═══════ WATCH TOGETHER ═══════
    initWatchTogether() {
        document.getElementById('createRoomBtn').onclick = () => this.createRoom();
        document.getElementById('joinRoomBtn').onclick = () => this.joinRoom();
        document.getElementById('copyRoomCode').onclick = () => this.copyRoomCodeFn();
        document.getElementById('wtLoadVideo').onclick = () => this.loadWTVideo();
    }

    createRoom() {
        const code = 'PT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('roomStatus').style.display = 'block';
        document.getElementById('roomCodeDisplay').textContent = code;
        this.currentRoomCode = code;
        this.showToast(`Room created! Code: ${code}`, 'success');
    }

    joinRoom() {
        const code = document.getElementById('joinRoomCode').value.trim();
        if (!code) { this.showToast('Enter a room code', 'error'); return; }
        document.getElementById('roomStatus').style.display = 'block';
        document.getElementById('roomCodeDisplay').textContent = code;
        this.currentRoomCode = code;
        this.showToast(`Joined room: ${code}`, 'success');
    }

    copyRoomCodeFn() {
        if (this.currentRoomCode) {
            this.copyToClipboard(this.currentRoomCode);
            this.showToast('Room code copied!', 'success');
        }
    }

    loadWTVideo() {
        const url = document.getElementById('wtVideoUrl').value.trim();
        if (!url) { this.showToast('Paste a video URL', 'error'); return; }
        const player = document.getElementById('wtPlayer');
        
        if (this.isYouTubeUrl(url)) {
            const videoId = this.getYouTubeId(url);
            player.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>`;
        } else if (/twitch\.tv/i.test(url)) {
            const channel = url.split('/').pop();
            player.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>`;
        } else {
            player.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>`;
        }
        this.showToast('Video loaded! Share the room code with friends.', 'success');
    }

    // ═══════ YOUTUBE ═══════
    initYouTube() {
        document.getElementById('ytPlayBtn').addEventListener('click', () => this.playYouTube());
        document.getElementById('ytSearchBtn').addEventListener('click', () => this.searchYouTube());
        document.getElementById('ytSearchInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.playYouTube();
        });
    }

    playYouTube() {
        const input = document.getElementById('ytSearchInput').value.trim();
        if (!input) { this.showToast('Paste a YouTube URL', 'error'); return; }
        
        // Extract video ID from various YouTube URL formats
        let videoId = null;
        if (this.isYouTubeUrl(input)) {
            videoId = this.getYouTubeId(input);
        } else if (input.length === 11 && /^[a-zA-Z0-9_-]+$/.test(input)) {
            // It's just a video ID
            videoId = input;
        }
        
        if (videoId) {
            document.getElementById('ytFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
            this.showToast('Playing video!', 'success');
        } else {
            // Not a valid URL, search YouTube in new tab
            this.searchYouTube();
        }
    }

    searchYouTube() {
        const query = document.getElementById('ytSearchInput').value.trim();
        if (!query) { this.showToast('Enter something to search', 'error'); return; }
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        this.showToast('Opening YouTube search...', 'info');
    }

    // ═══════ TWITCH ═══════
    initTwitch() {
        document.getElementById('twitchLoadBtn').onclick = () => {
            const channel = document.getElementById('twitchChannel').value.trim();
            if (channel) this.loadTwitch(channel);
        };
        document.getElementById('twitchChannel').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const channel = document.getElementById('twitchChannel').value.trim();
                if (channel) this.loadTwitch(channel);
            }
        });
    }

    loadTwitch(channel) {
        const hostname = location.hostname || 'localhost';
        document.getElementById('twitchFrame').src = `https://player.twitch.tv/?channel=${channel}&parent=${hostname}`;
        document.getElementById('twitchChannel').value = channel;
        this.showToast(`Loading ${channel}'s stream...`, 'info');
    }

    // ═══════ CHAT SYSTEM ═══════
    bindChat() {
        document.getElementById('chatToggle').addEventListener('click', () => {
            document.getElementById('chatPanel').classList.toggle('active');
        });
        document.getElementById('chatClose').addEventListener('click', () => {
            document.getElementById('chatPanel').classList.remove('active');
        });
        document.getElementById('chatJoinBtn').addEventListener('click', () => this.joinChat());
        document.getElementById('chatSendBtn').addEventListener('click', () => this.sendChatMsg());
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.sendChatMsg();
        });
        document.getElementById('chatUsername').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.joinChat();
        });
        document.getElementById('chatRoomId').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.joinChat();
        });
    }

    joinChat() {
        const name = document.getElementById('chatUsername').value.trim();
        const room = document.getElementById('chatRoomId').value.trim();
        if (!name) { this.showToast('Enter your name', 'error'); return; }
        if (!room) { this.showToast('Enter a room code', 'error'); return; }

        this.chatUsername = name;
        this.chatRoom = room;
        this.chatMessages = JSON.parse(localStorage.getItem(`chat_${room}`)) || [];

        // Enable input
        document.getElementById('chatInput').disabled = false;
        document.getElementById('chatSendBtn').disabled = false;

        // Show existing messages
        this.renderChatMessages();

        // Add join message
        this.addChatSystemMsg(`${name} joined the chat`);
        this.showToast(`Joined chat room: ${room}`, 'success');

        // Poll for new messages every 2 seconds (localStorage-based)
        if (this.chatInterval) clearInterval(this.chatInterval);
        this.chatInterval = setInterval(() => this.pollChatMessages(), 2000);
    }

    sendChatMsg() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg || !this.chatUsername || !this.chatRoom) return;

        const message = {
            id: Date.now(),
            name: this.chatUsername,
            text: msg,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };

        this.chatMessages.push(message);
        localStorage.setItem(`chat_${this.chatRoom}`, JSON.stringify(this.chatMessages));
        this.renderChatMessages();
        input.value = '';
    }

    pollChatMessages() {
        if (!this.chatRoom) return;
        const stored = JSON.parse(localStorage.getItem(`chat_${this.chatRoom}`)) || [];
        if (stored.length !== this.chatMessages.length) {
            this.chatMessages = stored;
            this.renderChatMessages();
            // Show badge for new messages
            const badge = document.getElementById('chatBadge');
            if (!document.getElementById('chatPanel').classList.contains('active')) {
                badge.classList.add('active');
                badge.textContent = '!';
            }
        }
    }

    renderChatMessages() {
        const container = document.getElementById('chatMessages');
        if (this.chatMessages.length === 0) {
            container.innerHTML = '<div class="chat-system-msg">No messages yet. Start chatting!</div>';
            return;
        }
        container.innerHTML = this.chatMessages.map(msg => {
            if (msg.system) {
                return `<div class="chat-system-msg">${msg.text}</div>`;
            }
            const isSent = msg.name === this.chatUsername;
            return `
                <div class="chat-msg ${isSent ? 'sent' : 'received'}">
                    <div class="chat-msg-name">${msg.name} • ${msg.time}</div>
                    ${msg.text}
                </div>
            `;
        }).join('');
        container.scrollTop = container.scrollHeight;
    }

    addChatSystemMsg(text) {
        this.chatMessages.push({ system: true, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) });
        localStorage.setItem(`chat_${this.chatRoom}`, JSON.stringify(this.chatMessages));
        this.renderChatMessages();
    }

    // ═══════ WATCHLIST & FAVORITES ═══════
    toggleWatchlist(id) {
        const idx = this.watchlist.indexOf(id);
        if (idx > -1) {
            this.watchlist.splice(idx, 1);
            this.showToast('Removed from watchlist', 'info');
        } else {
            this.watchlist.push(id);
            this.showToast('Added to watchlist!', 'success');
        }
        this.saveWatchlist();
        this.updateNotifBadge();
    }

    toggleFavorite(id) {
        const idx = this.favorites.indexOf(id);
        if (idx > -1) {
            this.favorites.splice(idx, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(id);
            this.showToast('Added to favorites!', 'success');
        }
        this.saveFavorites();
    }

    // ═══════ HELPERS ═══════
    getByTag(tag) {
        return this.content.filter(c => c.tags && c.tags.includes(tag));
    }

    getRecent() {
        return [...this.content].sort((a, b) =>
            new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
        ).slice(0, 15);
    }

    filterAndSort(items, genre, sort) {
        if (genre && genre !== 'all') {
            items = items.filter(i => i.genre === genre);
        }
        switch (sort) {
            case 'rating': items.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            case 'title': items.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'newest': default: items.sort((a, b) => (b.year || 0) - (a.year || 0)); break;
        }
        return items;
    }

    formatType(type) {
        if (type === 'tvshow') return 'TV Show';
        if (type === 'anime') return 'Anime';
        return 'Movie';
    }

    capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }

    getPlaceholder(title) {
        const encoded = encodeURIComponent(title || '?');
        return `https://placehold.co/300x450/13132a/00d4ff?text=${encoded}&font=roboto`;
    }

    updateNotifBadge() {
        const badge = document.getElementById('notifBadge');
        badge.textContent = this.watchlist.length;
        badge.style.display = this.watchlist.length > 0 ? 'flex' : 'none';
    }

    updateStats() {
        const movies = this.content.filter(c => c.type === 'movie').length;
        const anime = this.content.filter(c => c.type === 'anime').length;
        const tv = this.content.filter(c => c.type === 'tvshow').length;
        document.getElementById('statMovies').textContent = movies;
        document.getElementById('statAnime').textContent = anime;
        document.getElementById('statTV').textContent = tv;
        document.getElementById('statTotal').textContent = this.content.length;
    }

    // ═══════ STORAGE ═══════
    saveContent() { localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(this.content)); }
    saveWatchlist() { localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(this.watchlist)); }
    saveFavorites() { localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites)); }
    saveFriends() { localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(this.friends)); }

    // ═══════ CLIPBOARD ═══════
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => this.fallbackCopy(text));
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // ═══════ TOAST NOTIFICATIONS ═══════
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
        toast.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
}

// ═══════ INITIALIZE ═══════
const app = new PriismaTv();
